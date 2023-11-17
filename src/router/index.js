import { createRouter, createWebHistory } from "vue-router";
import swal from "sweetalert";
import Index from "../views/Index.vue";
import Dashboard from "../views/Dashboard.vue";
import Records from "../views/Records.vue";
import Funds from "../views/Funds.vue";
import Account from "../views/Account.vue";
import NotFound from "../views/NotFound.vue";
import { useAuthStore } from "../stores/authStore";

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
  },
  {
    path: "/records",
    name: "Records",
    component: Records,
  },
  {
    path: "/funds",
    name: "Funds",
    component: Funds,
  },
  {
    path: "/account",
    name: "Account",
    component: Account,
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();
  const tokenIsBlank = (authStore.auth.token === "" || authStore.auth.token === null || authStore.auth.token === undefined);
  const tokenExpired = new Date(authStore.auth.exp * 1000) < new Date();
  if ((tokenIsBlank) && to.name !== 'Index') {
    authStore.logout();
    swal({
      icon: "info",
      title: "Welcome",
      text: "Please, log in to start.",
      timer: 3000,
      button: false })
    return { name: 'Index' }
  }
  if ((tokenExpired) && to.name !== 'Index') {
    authStore.logout();
    swal({
      icon: "info",
      title: "Please log in",
      text: "Your session finished.",
      timer: 3000,
      button: false })
    return { name: 'Index' }
  }
});

export default router;
