import { createRouter, createWebHistory } from "vue-router";
import { authGuard } from '@auth0/auth0-vue';
import Index from "../views/Index.vue";
import Dashboard from "../views/Dashboard.vue";

const routes = [
  {
    path: "/",
    name: "Index",
    meta: { locked: false },
    component: Index,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    beforeEnter: authGuard,
  },
  {
    path: "/account",
    name: "Account",
    component: () => import('../views/Account.vue'),
    beforeEnter: authGuard,
  },
  {
    path: "/:catchAll(.*)",
    component: () => import('../views/NotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
