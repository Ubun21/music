import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home.vue'
import SingerDetail from '../views/SingerDetail'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  // {
  //   path: '/singer',
  //   name: 'singer',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/Singer.vue')
  // }
  {
    path: '/singer/',
    component: SingerDetail
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
