import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'meeting',
      component: () => import('../views/MeetingView.vue')
    }
  ]
})

export default router
