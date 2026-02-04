package static

import (
	"embed"
	"io/fs"
)

//go:embed all:out
var staticFS embed.FS

// StaticFS 返回 out 子目录的文件系统
var StaticFS, _ = fs.Sub(staticFS, "out")