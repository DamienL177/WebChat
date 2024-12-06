import { createRouter, createWebHistory } from 'vue-router'

import Login from '/src/views/Login.vue'
import Main from '/src/views/Main.vue'
import Logup from '/src/views/Logup.vue'

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
   history: createWebHistory(),
   routes
})

export default router;