import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home.vue'
import SingerDetail from '../views/SingerDetail'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { transition: 'not' }
  },
  {
    path: '/singer/',
    component: SingerDetail,
    meta: { transition: 'slider' }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
