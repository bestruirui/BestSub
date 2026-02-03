package share

import (
	"encoding/json"

	nodeModel "github.com/bestruirui/bestsub/internal/models/node"
)

type Data struct {
	ID             uint16 `db:"id" json:"id"`
	Enable         bool   `db:"enable" json:"enable"`
	Name           string `db:"name" json:"name"`
	Gen            string `db:"gen" json:"gen"`
	Token          string `db:"token" json:"token"`
	AccessCount    uint32 `db:"access_count" json:"access_count"`
	MaxAccessCount uint32 `db:"max_access_count" json:"max_access_count"`
	Expires        uint64 `db:"expires" json:"expires"`
}

type GenConfig struct {
	Filter nodeModel.Filter `json:"filter"`
	Rename string           `json:"rename"`
	Target string           `json:"target"`
}

type Request struct {
	Enable         bool      `json:"enable"`
	Name           string    `json:"name"`
	Token          string    `json:"token"`
	Gen            GenConfig `json:"gen"`
	MaxAccessCount uint32    `json:"max_access_count"`
	Expires        uint64    `json:"expires"`
}

type Response struct {
	ID             uint16    `json:"id"`
	Name           string    `json:"name"`
	Enable         bool      `json:"enable"`
	AccessCount    uint32    `json:"access_count"`
	MaxAccessCount uint32    `json:"max_access_count"`
	Expires        uint64    `json:"expires"`
	Token          string    `json:"token"`
	Gen            GenConfig `json:"gen"`
}

type UpdateAccessCountDB struct {
	ID          uint16 `db:"id"`
	AccessCount uint32 `db:"access_count"`
}

func (r *Request) GenData() Data {
	configBytes, err := json.Marshal(r.Gen)
	if err != nil {
		return Data{}
	}
	return Data{
		Enable:         r.Enable,
		Name:           r.Name,
		Token:          r.Token,
		MaxAccessCount: r.MaxAccessCount,
		Expires:        r.Expires,
		Gen:            string(configBytes),
	}
}

func (r *Data) GenResponse() Response {
	var config GenConfig
	if err := json.Unmarshal([]byte(r.Gen), &config); err != nil {
		return Response{}
	}
	return Response{
		ID:             r.ID,
		Name:           r.Name,
		Enable:         r.Enable,
		AccessCount:    r.AccessCount,
		MaxAccessCount: r.MaxAccessCount,
		Expires:        r.Expires,
		Token:          r.Token,
		Gen:            config,
	}
}
