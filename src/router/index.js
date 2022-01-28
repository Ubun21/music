import { createRouter, createWebHistory } from 'vue-router'
const Home = () => import('@/views/home.vue'/* webpackChunkName: "home" */)
const SingerDetail = () => import('@/views/SingerDetail'/* webpackChunkName: "user-center" */)
const TopDetail = () => import('@/views/topDetail'/* webpackChunkName: "user-center" */)
const RecomDetail = () => import('@/views/recomDetail'/* webpackChunkName: "user-center" */)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    children: [
      {
        path: '/album/',
        name: 'album',
        component: RecomDetail,
        meta: { transition: 'swiper' }
      },
      {
        path: '/singer/',
        name: 'singer',
        component: SingerDetail,
        meta: { transition: 'swiper' }
      },
      {
        path: '/top/',
        name: 'top',
        component: TopDetail,
        meta: { transition: 'swiper' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
