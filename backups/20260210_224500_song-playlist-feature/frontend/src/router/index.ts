import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/analyze',
    name: 'Analysis',
    component: () => import('../views/Analysis.vue')
  },
  {
    path: '/playlists', // Kept as 'playlists' path to match Nav, but conceptually 'Saved List'
    name: 'Playlists',
    component: () => import('../views/Playlists.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
