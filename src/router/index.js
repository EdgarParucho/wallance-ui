import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Index from '../views/Index.vue'
import Movements from '../views/Movements.vue'
import Funds from '../views/Funds.vue'

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
    path: '/movements',
    name: 'Movements',
    component: Movements
  },
  {
    path: '/funds',
    name: 'Funds',
    component: Funds
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
