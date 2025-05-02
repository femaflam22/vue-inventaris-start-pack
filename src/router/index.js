import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: AboutView
    },
    {
      path: '/stuffs',
      name: 'stuffs',
      component: () => import('../views/StuffView.vue')
    },
    {
      path: "/trash",
      name: "TrashView",
      component: () => import("../components/Trash.vue")
    },
    {
      path: "/inbounds",
      name: 'inbounds',
      component: () => import('../views/InboundView.vue')
    }
  ],
})

export default router
