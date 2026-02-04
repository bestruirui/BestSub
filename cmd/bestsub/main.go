package main

import (
	"github.com/bestruirui/bestsub/internal/config"
	"github.com/bestruirui/bestsub/internal/core/cron"
	"github.com/bestruirui/bestsub/internal/core/node"
	"github.com/bestruirui/bestsub/internal/core/task"
	"github.com/bestruirui/bestsub/internal/core/update"
	"github.com/bestruirui/bestsub/internal/database"
	"github.com/bestruirui/bestsub/internal/database/op"
	"github.com/bestruirui/bestsub/internal/models/setting"
	"github.com/bestruirui/bestsub/internal/server/server"
	"github.com/bestruirui/bestsub/internal/utils/info"
	"github.com/bestruirui/bestsub/internal/utils/log"
	"github.com/bestruirui/bestsub/internal/utils/shutdown"
)

func main() {

	info.Banner()

	cfg := config.Base()

	if err := log.Initialize(cfg.Log.Level, cfg.Log.Path, cfg.Log.Output); err != nil {
		panic(err)
	}
	if err := database.Initialize(cfg.Database.Type, cfg.Database.Path); err != nil {
		panic(err)
	}

	if err := server.Initialize(); err != nil {
		panic(err)
	}

	update.InitUI()

	task.Init(op.GetSettingInt(setting.TASK_MAX_THREAD))

	cron.Start()
	cron.FetchLoad()
	cron.CheckLoad()

	node.InitNodePool(op.GetSettingInt(setting.NODE_POOL_SIZE))

	log.CleanupOldLogs(5)

	server.Start()

	shutdown.Register(server.Close)       //   ↓↓
	shutdown.Register(database.Close)     //   ↓↓
	shutdown.Register(node.CloseNodePool) //   ↓↓
	shutdown.Register(log.Close)          //   ↓↓

	shutdown.Listen()
}
