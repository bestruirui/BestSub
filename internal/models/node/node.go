package node

import (
	"encoding/json"

	"github.com/bestruirui/bestsub/internal/utils/generic"
	"github.com/cespare/xxhash/v2"
)

const (
	Alive              uint64 = 1 << 0
	Country            uint64 = 1 << 1
	TikTok             uint64 = 1 << 2
	TikTokIDC          uint64 = 1 << 3
	// Residential 表示节点已明确判定为家宽。
	Residential        uint64 = 1 << 4
	// ResidentialChecked 表示节点已经完成家宽判定，无论结果是否为家宽。
	ResidentialChecked uint64 = 1 << 5
)

type Data struct {
	Base
	Info *Info
}

type Base struct {
	Raw       []byte
	SubId     uint16
	UniqueKey uint64
}

type UniqueKey struct {
	Server     string `yaml:"server"`
	Servername string `yaml:"servername"`
	Port       string `yaml:"port"`
	Type       string `yaml:"type"`
	Uuid       string `yaml:"uuid"`
	Username   string `yaml:"username"`
	Password   string `yaml:"password"`
}

type Info struct {
	SpeedUp     generic.Queue[uint32]
	SpeedDown   generic.Queue[uint32]
	Delay       generic.Queue[uint16]
	Risk        uint8
	AliveStatus uint64
	IP          uint32
	Country     string
}

type SimpleInfo struct {
	SpeedUp   uint32 `json:"speed_up"`
	SpeedDown uint32 `json:"speed_down"`
	Delay     uint16 `json:"delay"`
	Risk      uint8  `json:"risk"`
	Count     uint32 `json:"count"`
}

type Filter struct {
	SubId         []uint16 `json:"sub_id"`
	SubIdExclude  bool     `json:"sub_id_exclude"`
	SpeedUpMore   uint32   `json:"speed_up_more"`
	SpeedDownMore uint32   `json:"speed_down_more"`
	Country       []string `json:"country"`
	CountryExclude bool    `json:"country_exclude"`
	DelayLessThan uint16   `json:"delay_less_than"`
	AliveStatus   uint64   `json:"alive_status"`
	RiskLessThan  uint8    `json:"risk_less_than"`
}

func (i *Info) SetAliveStatus(AliveStatus uint64, status bool) {
	if status {
		i.AliveStatus |= AliveStatus
	} else {
		i.AliveStatus &= ^AliveStatus
	}
}

func (i *Info) HasAliveStatus(status uint64) bool {
	return i.AliveStatus&status == status
}

// IsResidentialChecked 用于区分“未检测”和“已检测非家宽”。
func (i *Info) IsResidentialChecked() bool {
	return i.HasAliveStatus(ResidentialChecked)
}

func (i *Info) IsResidential() bool {
	return i.HasAliveStatus(Residential)
}

// SetResidentialStatus 在写入家宽结果时同步补上已检测标记，避免出现非法状态组合。
func (i *Info) SetResidentialStatus(residential bool) {
	i.SetAliveStatus(Residential, residential)
	i.SetAliveStatus(ResidentialChecked, true)
}

func (u *UniqueKey) Gen() uint64 {
	bytes, _ := json.Marshal(u)
	return xxhash.Sum64(bytes)
}
