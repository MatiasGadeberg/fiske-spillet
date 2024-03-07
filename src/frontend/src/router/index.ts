import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
        path: '/pre-game',
        name: 'pre-game',
        // route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../views/PreGameView.vue'),
    },
    {
        path: '/game',
        name: 'game',
        // route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../views/GameView.vue'),
            children: [
            { path: 'boat', component: () => import('../views/game-views/BoatMarketView.vue') },
                { path: 'fish', component: () => import('../views/game-views/FishMarketView.vue') },
                { path: 'ocean', component: () => import('../views/game-views/OceanView.vue') }
        ]
    },
    {
        path: '/post-game',
        name: 'post-game',
        // route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../views/PostGameView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/LoginView.vue')
    },
  ]
})

router.beforeEach((to, _) => {
  const auth = useAuthStore()
  const loginCookie = sessionStorage.getItem("loggedIn");
  const loggedIn = auth.isLoggedIn || loginCookie
  if (!loggedIn && to.name !== 'login') {
    return { name: 'login' }
  }
})

export default router
