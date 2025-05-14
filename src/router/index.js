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
      component: AboutView,
      // meta : memberi properti tambahan
      // requiresAuth : route yg boleh diakses setelah login
      // roles : tipe role yg boleh mengakses
      meta: { requiresAuth: true, roles: ['admin', 'staff'] }
    },
    {
      path: '/stuffs',
      name: 'stuffs',
      component: () => import('../views/StuffView.vue'),
      meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
      path: "/trash",
      name: "TrashView",
      component: () => import("../components/Trash.vue"),
      meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
      path: "/inbounds",
      name: "inbounds",
      component: () => import("../views/InboundView.vue"),
      meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
      path: "/lendings",
      name: "lendings",
      component: () => import("../views/LendingView.vue"),
      meta: { requiresAuth: true, roles: ['staff'] }
    }
  ],
})

// pengecekan dan redirect
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('access_token');
  const userRole = JSON.parse(localStorage.getItem('user'))?.role;

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      // jika blm login diarahkan ke halaman login (home)
      return next({name: 'home'});
    }

    if (to.meta.roles && !to.meta.roles.includes(userRole)) {
      // jika role yg mencoba akses tidak sesuai
      return next({name: 'profile'});
    }
  }

  // jika sesuai, maka diperbolehkan akses
  next();
})

export default router
