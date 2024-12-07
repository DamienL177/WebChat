import { createRouter, createWebHistory } from 'vue-router'
import Main from '/src/views/Main.vue'

const routes = [
   {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
   },
   {
      path: '/',
      component: Main,
   },
   {
      path: '/logup',
      name: 'logup',
      component: () => import('../views/Logup.vue'),
   },
]

const router = createRouter({
   history: createWebHistory(),
   routes
})

export default router;