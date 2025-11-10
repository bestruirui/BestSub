# BestSub

BestSub 是一个高性能的节点检测，订阅转换服务，基于 Go 语言开发。该项目提供了完整的 Web 界面和 API 接口，支持多种检测项目，多种订阅格式转换，为用户提供便捷的订阅管理解决方案。

## ✨ 主要特性

- 🎨 **现代的 WebUI**: 提供现代化的 Web 管理界面，完善的 API 文档，方便用户自定义开发
- ⚡ **高性能**: 并发处理，低 CPU 占用，低内存消耗，优化的资源利用率
- 🎲 **分享**: 高度自定义的分享功能,自定义节点名称,过期时间,最大访问量,节点类型,国家....
- 🌍 **多架构**: 支持多种系统架构和操作系统，广泛的兼容性
- 🗂️ **节点池**: 可持久化保存历史节点，智能淘汰质量低下的节点，确保最佳体验
- 🔄 **内置 Subconverter**: 支持各种订阅格式的输入输出转换
- 🔧 **扩展**: 模块化设计，支持 PR 扩展新功能，仅需创建单个文件即可添加新的通知、保存或检测方式
- 📢 **通知**: 支持多样化的通知方式和自定义通知模板，满足不同场景的消息推送需求
- 💾 **保存**: 支持多样化的数据保存方式，灵活的数据持久化选择
- 🔍 **检测**: 支持多样化的节点检测方式，全面的质量评估体系

## 🚀 快速开始

### 方式一：直接运行

1. 从 [Releases](https://github.com/bestruirui/BestSub/releases/latest) 页面下载适合您系统架构的可执行文件
2. 直接运行程序，系统将自动：
   - 创建必要的配置文件
   - 下载 WebUI 
   - 下载 Subconverter

### 方式二：Docker

```bash
docker run -d \
    --name bestsub \
    -e PUID=1000 \
    -e PGID=1000 \
    --restart unless-stopped \
    -v /path/to/data:/app/data \
    -p 8080:8080 \
    ghcr.io/bestruirui/bestsub
```

**参数说明:**
- `--name bestsub`: 设置容器名称
- `--restart unless-stopped`: 容器自动重启策略
- `-v /path/to/data:/app/data`: 数据持久化挂载（请将 `/path/to/data` 替换为您的实际路径）
- `-p 8080:8080`: 端口映射，访问地址为 `http://localhost:8080`

### 方式三：Docker Compose

创建 `docker-compose.yml` 文件：

```yaml
services:
  bestsub:
    image: ghcr.io/bestruirui/bestsub:latest
    container_name: bestsub
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
    ports:
      - "8080:8080"
    volumes:
      - ./data:/app/data
```

启动服务：
```bash
docker-compose up -d
```

## 📁 目录结构

程序运行后将创建以下目录结构：

```
bestsub/
├── config.json              # 主配置文件
├── data/                    # 数据目录
│   └── bestsub.db          # SQLite 数据库文件
├── log/                     # 日志文件目录
├── session/                 # 会话数据目录
│   └── bestsub.session     # 会话文件
├── subconverter/           # 订阅转换器目录
│   ├── base/               # 转换规则基础配置
│   │   └── base/
│   │       └── all_base.tpl
│   ├── pref.yml           # 转换器配置文件
│   └── subconverter       # 转换器可执行文件
└── ui/                     # Web 界面文件
    ├── index.html         # 主页面
    └── ...                # 其他静态资源
```

## 🛠️ 手动部署

当自动下载失败时，请按以下步骤手动部署：

1. **下载 WebUI 组件**
   - 访问 [bestruirui/BestSubFront](https://github.com/bestruirui/BestSubFront/releases/latest)
   - 下载最新版本并解压到 `ui` 目录

2. **下载 Subconverter 组件**
   - 访问 [bestruirui/subconverter](https://github.com/bestruirui/subconverter/releases/latest)
   - 下载对应系统架构的版本并解压到 `subconverter` 目录

3. **验证部署**
   - 确保目录结构与上述 [目录结构](#-目录结构) 章节一致
   - 重新启动程序

## 🔗 版本历史

### 当前版本 (v1.x)
- 全新的 Web 界面
- 增强的性能和稳定性
- 完整的容器化支持

### 经典版本 (v0.3.5)
- **命令行界面版本**
- **[📖 查看文档](https://github.com/bestruirui/BestSub/blob/legacy/doc/README_zh.md)** 
- **[⬇️ 下载应用](https://github.com/bestruirui/BestSub/releases/tag/v0.3.5)**

## 📋 版本规范

### 版本格式

版本号采用语义化版本格式：**`vX.Y.Z`**

- **`X`** (主版本号 - Major)
- **`Y`** (次版本号 - Minor)  
- **`Z`** (修订版本号 - Patch)

### 版本变更规则

**🔢 主版本号 (X - Major)**
- 主版本号增加表示**重大更新**
- 包含**破坏性变更 (Breaking Changes)**，如：
  - 数据结构、API 接口的不兼容性修改
  - 重大的架构调整或重构
- 当主版本号增加时，次版本号和修订版本号归零
- 示例：`v1.5.3` → `v2.0.0`

**⚡ 次版本号 (Y - Minor)**
- 次版本号增加表示**功能更新**
- 包含向后兼容的功能性新增或增强
- **前后端版本号在此位必须保持一致**，确保功能正常调用和兼容
- 当次版本号增加时，修订版本号归零
- 示例：`v1.2.8` → `v1.3.0`

**🔧 修订版本号 (Z - Patch)**
- 修订版本号增加表示**问题修复**或微小优化
- 用于修复向后兼容的 Bug 或进行小幅优化调整
- 此版本更新不要求前后端严格同步，但建议保持一致
- 示例：`v1.3.0` → `v1.3.1`

## 🤝 贡献指南

我们欢迎任何形式的贡献！

### 项目图标
- **格式要求**: SVG 格式  
- **用途**: 项目 Logo 和品牌标识  
- **提交方式**: 创建 Issue 或 Pull Request  

### 更多功能

- 新的节点检测项目  
- 新的储存渠道  
- 新的通知渠道  

### 其他贡献方式
- 🐛 报告 Bug
- 💡 提出新功能建议
- 📝 改进文档
- 🧪 编写测试用例

## 🤝 贡献者

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## ⚠️ 免责声明

本项目仅供学习和研究使用。使用本软件时，请您：

- ✅ 遵守当地法律法规和相关政策
- ✅ 尊重网络服务提供商的使用条款
- ✅ 承担使用本软件可能产生的一切后果和责任
- ⚠️ 理解作者不对使用本软件造成的任何损失承担责任

**请在合法合规的前提下使用本软件。如果您不同意上述条款，请勿使用本软件。**

## ❤️ 支持项目

如果这个项目对您有帮助，请考虑：

- ⭐ 给项目点个 Star
- 🍴 Fork 项目并参与开发
- 📢 向朋友推荐本项目
- 💬 在社区中分享使用体验

## 📊 项目统计

![Repobeats analytics image](https://repobeats.axiom.co/api/embed/dfefb13ae0ed117da68382c0ed63695992826039.svg "Repobeats analytics image")
