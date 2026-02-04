package share

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"text/template"

	"github.com/bestruirui/bestsub/internal/core/node"
	"github.com/bestruirui/bestsub/internal/core/subconv"
	"github.com/bestruirui/bestsub/internal/database/op"
	"github.com/bestruirui/bestsub/internal/models/share"
	"github.com/bestruirui/bestsub/internal/utils"
	"github.com/bestruirui/bestsub/internal/utils/country"
)

func GenSubData(genConfigStr string) []byte {
	var genConfig share.GenConfig
	if err := json.Unmarshal([]byte(genConfigStr), &genConfig); err != nil {
		return nil
	}
	nodes := node.GetByFilter(genConfig.Filter)
	var result bytes.Buffer
	result.Write(nodeData)
	tmpl, err := renameTemplate.Parse(genConfig.Rename)
	if err != nil {
		return nil
	}
	var newName bytes.Buffer
	for i, node := range *nodes {
		newName.Reset()
		result.Write(dash)
		subTags := op.GetSubTagsByID(context.Background(), node.Base.SubId)
		simpleInfo := renameTmpl{
			SpeedUp:       node.Info.SpeedUp.Average(),
			SpeedDown:     node.Info.SpeedDown.Average(),
			Delay:         uint32(node.Info.Delay.Average()),
			Risk:          uint32(node.Info.Risk),
			Count:         uint32(i + 1),
			Country:       country.GetCountry(node.Info.Country),
			IP:            utils.Uint32ToIP(node.Info.IP),
			SubName:       op.GetSubNameByID(context.Background(), node.Base.SubId),
			SubTags:       fmt.Sprintf("<%s>", strings.Join(subTags, "|")),
			SubTagsOrigin: subTags,
		}
		tmpl.Execute(&newName, simpleInfo)
		result.Write(rename(node.Base.Raw, newName.Bytes()))
		result.Write(newLine)
	}
	resultStr := subconv.ConvertData(result.String(), genConfig.Target)
	return []byte(resultStr)
}

func GenNodeData(config string) []byte {
	var genConfig share.GenConfig
	if err := json.Unmarshal([]byte(config), &genConfig); err != nil {
		return nil
	}
	nodes := node.GetByFilter(genConfig.Filter)
	var result bytes.Buffer
	result.Write(nodeData)
	tmpl, err := renameTemplate.Parse(genConfig.Rename)
	if err != nil {
		return nil
	}
	var newName bytes.Buffer
	for i, node := range *nodes {
		newName.Reset()
		result.Write(dash)
		subTags := op.GetSubTagsByID(context.Background(), node.Base.SubId)
		simpleInfo := renameTmpl{
			SpeedUp:       node.Info.SpeedUp.Average(),
			SpeedDown:     node.Info.SpeedDown.Average(),
			Delay:         uint32(node.Info.Delay.Average()),
			Risk:          uint32(node.Info.Risk),
			Count:         uint32(i + 1),
			Country:       country.GetCountry(node.Info.Country),
			IP:            utils.Uint32ToIP(node.Info.IP),
			SubName:       op.GetSubNameByID(context.Background(), node.Base.SubId),
			SubTags:       fmt.Sprintf("<%s>", strings.Join(subTags, "|")),
			SubTagsOrigin: subTags,
		}
		tmpl.Execute(&newName, simpleInfo)
		result.Write(rename(node.Base.Raw, newName.Bytes()))
		result.Write(newLine)
	}
	return result.Bytes()
}

func rename(raw []byte, newName []byte) []byte {
	var node map[string]any
	if err := json.Unmarshal(raw, &node); err != nil {
		return raw
	}
	node["name"] = string(newName)
	out, err := json.Marshal(node)
	if err != nil {
		return raw
	}
	return out
}

var (
	nodeData = []byte("proxies:\n")
	newLine  = []byte("\n")
	dash     = []byte(" - ")
)

type renameTmpl struct {
	SpeedUp       uint32
	SpeedDown     uint32
	Delay         uint32
	Risk          uint32
	Country       country.Country
	Count         uint32
	IP            string
	SubName       string
	SubTags       string
	SubTagsOrigin []string
}

var renameTemplate = template.New("node").Funcs(template.FuncMap{
	"add": func(x, y uint32) uint32 {
		return x + y
	},
	"sub": func(x, y uint32) uint32 {
		return x - y
	},
	"div": func(x, y uint32) uint32 {
		if y == 0 {
			return 0
		}
		return x / y
	},
	"mod": func(x, y uint32) uint32 {
		if y == 0 {
			return 0
		}
		return x % y
	},
})
