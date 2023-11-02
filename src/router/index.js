import { createRouter, createWebHistory } from "vue-router";
import swal from "sweetalert";
import { useCredentialStore } from "../stores/credentialStore";
import Dashboard from "../views/Dashboard.vue";
import Index from "../views/Index.vue";
import Records from "../views/Records.vue";
import Funds from "../views/Funds.vue";
import Account from "../views/Account.vue";
import NotFound from "../views/NotFound.vue";

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
  const credentialStore = useCredentialStore();
  const tokenIsBlank = (credentialStore.credential.token === "" || credentialStore.credential.token === null || credentialStore.credential.token === undefined);
  const tokenExpired = new Date(credentialStore.credential.exp * 1000) < new Date();
  if ((tokenIsBlank) && to.name !== 'Index') {
    credentialStore.logout();
    swal({
      icon: "info",
      title: "Welcome",
      text: "Please, log in to start.",
      timer: 3000,
      button: false })
    return { name: 'Index' }
  }
  if ((tokenExpired) && to.name !== 'Index') {
    credentialStore.logout();
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
