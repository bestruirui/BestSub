export const API_PATH = {
  base: process.env.NEXT_PUBLIC_API_BASEURL?.endsWith('/') ? process.env.NEXT_PUBLIC_API_BASEURL.slice(0, -1) : process.env.NEXT_PUBLIC_API_BASEURL || '',
  auth: {
    login: '/api/v1/auth/login',
    logout: '/api/v1/auth/logout',
    user: '/api/v1/auth/user',
    password: '/api/v1/auth/user/password',
    name: '/api/v1/auth/user/name',
  },
  sub: '/api/v1/sub',
  check: '/api/v1/check',
  notify: '/api/v1/notify',
  share: '/api/v1/share',
  setting: '/api/v1/setting',
  system: {
    health: '/api/v1/system/health',
    info: '/api/v1/system/info',
    version: '/api/v1/system/version',
  },
  update: {
    base: '/api/v1/update',
    latest: '/api/v1/update',
  },
}

export const APP_CONFIG = {
  name: 'BestSub',
  version: '1.0.0',
  author: 'BestSub',
}


export const APP_ROUTES = {
  LOGIN: {
    title: "登录",
    path: "/login",
  },
  DASHBOARD: {
    title: "仪表盘",
    path: "/dashboard",
  },
  SUB: {
    title: "订阅管理",
    path: "/sub",
  },
  CHECK: {
    title: "检测任务",
    path: "/check",
  },
  SHARE: {
    title: "分享管理",
    path: "/share",
  },
  STORAGE: {
    title: "存储配置",
    path: "/storage",
  },
  NOTIFY: {
    title: "通知配置",
    path: "/notify",
  },
  LOG: {
    title: "日志查看",
    path: "/log",
  },
  HELP: {
    title: "帮助文档",
    path: "/help",
  },
  GITHUB: {
    title: "GitHub",
    path: "https://github.com/bestruirui/BestSub",
  },
}
