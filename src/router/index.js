import { createRouter, createWebHistory } from "vue-router";
import Index from "../views/Index.vue";
import Dashboard from "../views/Dashboard.vue";
import Funds from "../views/Funds.vue";
import Account from "../views/Account.vue";
import { authGuard } from '@auth0/auth0-vue';

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
    path: "/funds",
    name: "Funds",
    component: Funds,
    beforeEnter: authGuard,
  },
  {
    path: "/account",
    name: "Account",
    component: Account,
    beforeEnter: authGuard,
  },
  {
    path: "/projection",
    name: "Projection",
    component: () => import('../views/Projection.vue'),
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
