import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home.vue'
import SingerDetail from '../views/SingerDetail'
import TopDetail from '../views/topDetail'
import RecomDetail from '../views/recomDetail'

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
  },
  {
    path: '/top/',
    component: TopDetail
  },
  {
    path: '/album/',
    component: RecomDetail
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
