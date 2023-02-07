import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Index from '../views/Index.vue'
import RecordsHistory from '../views/RecordsHistory.vue'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/history',
    name: 'History',
    component: RecordsHistory
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
