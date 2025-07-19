package database

import (
	"context"

	"github.com/bestruirui/bestsub/internal/database/client/sqlite"
	"github.com/bestruirui/bestsub/internal/database/interfaces"
	"github.com/bestruirui/bestsub/internal/database/op"
	"github.com/bestruirui/bestsub/internal/utils/log"
)

func Initialize(sqltype, path string) error {
	var err error
	var repo interfaces.Repository
	switch sqltype {
	case "sqlite":
		repo, err = sqlite.New(path)
		if err != nil {
			log.Fatalf("failed to create sqlite database: %v", err)
		}
	default:
		log.Fatalf("unsupported database type: %s", sqltype)
	}
	op.SetRepo(repo)
	if err := repo.Migrate(); err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}
	if err := initAuth(context.Background(), op.AuthRepo()); err != nil {
		log.Fatalf("failed to initialize auth: %v", err)
	}
	if err := initSystemConfig(context.Background(), op.ConfigRepo()); err != nil {
		log.Fatalf("failed to initialize system config: %v", err)
	}
	if err := initTask(context.Background(), op.TaskRepo()); err != nil {
		log.Fatalf("failed to initialize tasks: %v", err)
	}
	return nil
}
func Close() error {
	if err := op.Close(); err != nil {
		log.Errorf("failed to close database: %v", err)
		return err
	}
	log.Debugf("数据库关闭成功")
	return nil
}
