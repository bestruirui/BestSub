package subconv

import (
	_ "embed"
	"fmt"
	"sync"

	"github.com/dop251/goja"
)

//go:embed subconv.es5.js
var subconvJS string

var (
	vm *goja.Runtime
	mu sync.Mutex
)

func init() {
	vm = goja.New()
	_, err := vm.RunString(subconvJS)
	if err != nil {
		panic(fmt.Sprintf("failed to load substore.js: %v", err))
	}
	vm.Set("console", map[string]interface{}{
		"log": fmt.Println,
	})
}

func Convert(raw string, target string) string {
	mu.Lock()
	defer mu.Unlock()

	vm.Set("_raw", raw)
	vm.Set("_target", target)

	result, err := vm.RunString(`SubConv.ProxyUtils.convert(_raw, _target)`)
	if err != nil {
		fmt.Println(err)
		return ""
	}
	return result.String()
}
