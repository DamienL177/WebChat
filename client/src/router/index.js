import { createRouter, createWebHistory } from 'vue-router'

import Login from '/src/Login.vue'
import Main from '/src/Main.vue'
import Logup from '/src/Logup.vue'

const routes = [
   {
      path: '/login',
      component: Login,
   },
   {
      path: '/',
      component: Main,
   },
   {
      path: '/logup',
      component: Logup,
   },
]

const router = createRouter({
   history: createWebHistory('/'),
   routes
})

export default router