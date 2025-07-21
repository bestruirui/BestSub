package interfaces

import (
	"context"

	"github.com/bestruirui/bestsub/internal/models/notify"
)

// NotificationChannelRepository 通知渠道数据访问接口
type NotifyRepository interface {
	// Create 创建通知渠道
	Create(ctx context.Context, channel *notify.Data) error

	// GetByID 根据ID获取通知渠道
	GetByID(ctx context.Context, id uint16) (*notify.Data, error)

	// Update 更新通知渠道
	Update(ctx context.Context, channel *notify.Data) error

	// Delete 删除通知渠道
	Delete(ctx context.Context, id uint16) error

	// List 获取通知渠道列表
	List(ctx context.Context) (*[]notify.Data, error)

	// Count 获取通知渠道总数
	Count(ctx context.Context) (uint16, error)

	// 根据任务ID获取通知渠道列表
	GetByTaskID(ctx context.Context, taskID uint16) (*[]notify.Data, error)

	// 添加通知渠道与任务的关联
	AddTaskRelation(ctx context.Context, notifyID, taskID uint16) error
}

// NotificationTemplateRepository 通知模板数据访问接口
type NotifyTemplateRepository interface {
	// Create 创建通知模板
	Create(ctx context.Context, template *notify.Template) error

	// GetByType 根据类型获取通知模板
	GetByType(ctx context.Context, t string) (*notify.Template, error)

	// Update 更新通知模板
	Update(ctx context.Context, template *notify.Template) error

	// List 获取通知模板列表
	List(ctx context.Context) (*[]notify.Template, error)
}
