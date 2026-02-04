import { Route } from './core/context'

import { DashboardPage } from '@/src/components/features/home/dashboard'
import { SubPage, CheckPage, SharePage, StoragePage, NotifyPage, LoginPage } from '@/src/components/features'
import { APP_ROUTES } from '@/src/lib/config/config'
export const routes: Route[] = [
  {
    path: APP_ROUTES.LOGIN.path,
    component: LoginPage,
    title: APP_ROUTES.LOGIN.title,
    protected: false,
    preloadImport: () => import('@/src/components/features/login'),
    priority: 'normal',
  },
  {
    path: APP_ROUTES.DASHBOARD.path,
    component: DashboardPage,
    title: APP_ROUTES.DASHBOARD.title,
    protected: true,
    preloadImport: () => import('@/src/components/features/home/dashboard'),
    priority: 'critical',
  },
  {
    path: APP_ROUTES.SUB.path,
    component: SubPage,
    title: APP_ROUTES.SUB.title,
    protected: true,
    preloadImport: () => import('@/src/components/features/sub'),
    priority: 'critical',
  },
  {
    path: APP_ROUTES.CHECK.path,
    component: CheckPage,
    title: APP_ROUTES.CHECK.title,
    protected: true,
    preloadImport: () => import('@/src/components/features/check'),
    priority: 'normal',
  },
  {
    path: APP_ROUTES.SHARE.path,
    component: SharePage,
    title: APP_ROUTES.SHARE.title,
    protected: true,
    preloadImport: () => import('@/src/components/features/share'),
    priority: 'normal',
  },
  {
    path: APP_ROUTES.STORAGE.path,
    component: StoragePage,
    title: APP_ROUTES.STORAGE.title,
    protected: true,
    preloadImport: () => import('@/src/components/features/storage/storage'),
    priority: 'low',
  },
  {
    path: APP_ROUTES.NOTIFY.path,
    component: NotifyPage,
    title: APP_ROUTES.NOTIFY.title,
    protected: true,
    preloadImport: () => import('@/src/components/features/notify'),
    priority: 'normal',
  },
]
