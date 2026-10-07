package mihomo

import (
	"context"
	"fmt"
	"net"
	"net/http"
	"strconv"

	"github.com/metacubex/mihomo/adapter/outbound"
	"github.com/metacubex/mihomo/component/proxydialer"
	"github.com/metacubex/mihomo/component/resolver"
	"github.com/metacubex/mihomo/constant"
	"github.com/metacubex/mihomo/dns"
	"gopkg.in/yaml.v3"

	"github.com/metacubex/mihomo/common/structure"
)

var decoder = structure.NewDecoder(structure.Option{
	TagName:          "proxy",
	WeaklyTypedInput: true,
	KeyReplacer:      structure.DefaultKeyReplacer,
})

func init() {
	resolver.SystemResolver = dns.NewResolver(dns.Config{
		Main: []dns.NameServer{
			{Net: "https", Addr: "https://doh.pub/dns-query"},
			{Net: "https", Addr: "https://dns.alidns.com/dns-query"},
		},
		Default: []dns.NameServer{
			{Net: "udp", Addr: "119.29.29.29:53"},
			{Net: "udp", Addr: "223.5.5.5:53"},
		},
	})
}

func UpdateDNSConfig(defaultServers, mainServers []string) {
	if len(defaultServers) == 0 && len(mainServers) == 0 {
		return
	}

	cfg := dns.Config{}

	for _, s := range defaultServers {
		if _, _, err := net.SplitHostPort(s); err != nil {
			s = net.JoinHostPort(s, "53")
		}
		cfg.Default = append(cfg.Default, dns.NameServer{Net: "udp", Addr: s})
	}

	for _, s := range mainServers {
		cfg.Main = append(cfg.Main, dns.NameServer{Net: "https", Addr: s})
	}

	resolver.SystemResolver = dns.NewResolver(cfg)
}

// NewTransport 创建单代理或链式代理的 http.Transport。
// inner 为空时链路为本地 -> outer -> 目标；否则为本地 -> outer -> inner -> 目标。
func NewTransport(outer, inner []byte, interfaceName string) (*http.Transport, func() error, error) {
	var outerMapping map[string]any
	if err := yaml.Unmarshal(outer, &outerMapping); err != nil {
		return nil, nil, fmt.Errorf("parse outer: %w", err)
	}
	if outerMapping == nil {
		return nil, nil, fmt.Errorf("nil outer mapping")
	}
	// 网卡只绑定 outer，inner 的服务器连接必须经过 outer。
	if interfaceName != "" {
		outerMapping["interface-name"] = interfaceName
	}

	outerAdapter, err := createAdapter(outerMapping)
	if err != nil {
		return nil, nil, fmt.Errorf("create outer adapter: %w", err)
	}
	if len(inner) == 0 {
		return buildTransport(outerAdapter), outerAdapter.Close, nil
	}

	var innerMapping map[string]any
	if err := yaml.Unmarshal(inner, &innerMapping); err != nil {
		outerAdapter.Close()
		return nil, nil, fmt.Errorf("parse inner: %w", err)
	}
	if innerMapping == nil {
		outerAdapter.Close()
		return nil, nil, fmt.Errorf("nil inner mapping")
	}
	innerAdapter, err := createAdapter(innerMapping, proxydialer.New(outerAdapter, false))
	if err != nil {
		// inner 创建失败后 outer 已无调用方持有，必须立即释放。
		outerAdapter.Close()
		return nil, nil, fmt.Errorf("create inner adapter: %w", err)
	}

	return buildTransport(innerAdapter), func() error {
		// 先关闭 inner，再关闭承载其链路的 outer；两者都必须尝试关闭。
		if err := innerAdapter.Close(); err != nil {
			outerAdapter.Close()
			return err
		}
		return outerAdapter.Close()
	}, nil
}

// createAdapter 从已解析的单条代理配置创建 outbound.ProxyAdapter
// chainDialer 可选，用于链式代理：inner 通过该 dialer 连接自己的服务器
func createAdapter(mapping map[string]any, chainDialer ...constant.Dialer) (outbound.ProxyAdapter, error) {
	proxyType, _ := mapping["type"].(string)

	// 链式代理 dialer，设到 option.DialerForAPI 后构造函数会自动使用
	var dialer constant.Dialer
	if len(chainDialer) > 0 {
		dialer = chainDialer[0]
	}

	switch proxyType {
	case "ss":
		o := &outbound.ShadowSocksOption{}
		if err := decoder.Decode(mapping, o); err != nil {
			return nil, err
		}
		o.DialerForAPI = dialer
		return outbound.NewShadowSocks(*o)
	case "ssr":
		o := &outbound.ShadowSocksROption{}
		if err := decoder.Decode(mapping, o); err != nil {
			return nil, err
		}
		o.DialerForAPI = dialer
		return outbound.NewShadowSocksR(*o)
	case "socks5":
		o := &outbound.Socks5Option{}
		if err := decoder.Decode(mapping, o); err != nil {
			return nil, err
		}
		o.DialerForAPI = dialer
		return outbound.NewSocks5(*o)
	case "http":
		o := &outbound.HttpOption{}
		if err := decoder.Decode(mapping, o); err != nil {
			return nil, err
		}
		o.DialerForAPI = dialer
		return outbound.NewHttp(*o)
	case "vmess":
		o := &outbound.VmessOption{}
		if err := decoder.Decode(mapping, o); err != nil {
			return nil, err
		}
		o.DialerForAPI = dialer
		return outbound.NewVmess(*o)
	case "vless":
		o := &outbound.VlessOption{}
		if err := decoder.Decode(mapping, o); err != nil {
			return nil, err
		}
		o.DialerForAPI = dialer
		return outbound.NewVless(*o)
	case "snell":
		o := &outbound.SnellOption{}
		if err := decoder.Decode(mapping, o); err != nil {
			return nil, err
		}
		o.DialerForAPI = dialer
		return outbound.NewSnell(*o)
	case "trojan":
		o := &outbound.TrojanOption{}
		if err := decoder.Decode(mapping, o); err != nil {
			return nil, err
		}
		o.DialerForAPI = dialer
		return outbound.NewTrojan(*o)
	case "hysteria":
		o := &outbound.HysteriaOption{}
		if err := decoder.Decode(mapping, o); err != nil {
			return nil, err
		}
		o.DialerForAPI = dialer
		return outbound.NewHysteria(*o)
	case "hysteria2":
		o := &outbound.Hysteria2Option{}
		if err := decoder.Decode(mapping, o); err != nil {
			return nil, err
		}
		o.DialerForAPI = dialer
		return outbound.NewHysteria2(*o)
	case "wireguard":
		o := &outbound.WireGuardOption{}
		if err := decoder.Decode(mapping, o); err != nil {
			return nil, err
		}
		o.DialerForAPI = dialer
		return outbound.NewWireGuard(*o)
	case "tuic":
		o := &outbound.TuicOption{}
		if err := decoder.Decode(mapping, o); err != nil {
			return nil, err
		}
		o.DialerForAPI = dialer
		return outbound.NewTuic(*o)
	case "ssh":
		o := &outbound.SshOption{}
		if err := decoder.Decode(mapping, o); err != nil {
			return nil, err
		}
		o.DialerForAPI = dialer
		return outbound.NewSsh(*o)
	case "mieru":
		o := &outbound.MieruOption{}
		if err := decoder.Decode(mapping, o); err != nil {
			return nil, err
		}
		o.DialerForAPI = dialer
		return outbound.NewMieru(*o)
	case "anytls":
		o := &outbound.AnyTLSOption{}
		if err := decoder.Decode(mapping, o); err != nil {
			return nil, err
		}
		o.DialerForAPI = dialer
		return outbound.NewAnyTLS(*o)
	default:
		return nil, fmt.Errorf("unsupported proxy type: %s", proxyType)
	}
}

// buildTransport 从 ProxyAdapter 构建 http.Transport
func buildTransport(proxy outbound.ProxyAdapter) *http.Transport {
	return &http.Transport{
		DisableKeepAlives: true,
		DialContext: func(ctx context.Context, network, addr string) (net.Conn, error) {
			host, portStr, err := net.SplitHostPort(addr)
			if err != nil {
				return nil, err
			}
			port, err := strconv.ParseUint(portStr, 10, 16)
			if err != nil {
				port = 0
			}
			return proxy.DialContext(ctx, &constant.Metadata{
				Host:    host,
				DstPort: uint16(port),
			})
		},
	}
}
