import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'
import JsonExcel from "vue-json-excel3";
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createAuth0 } from '@auth0/auth0-vue';
import './style.css'
import 'vue-toastification/dist/index.css'

const pinia = createPinia()

createApp(App)
  .component("downloadExcel", JsonExcel)
  .use(router)
  .use(pinia)
  .use(Toast)
  .use(
    createAuth0({
      domain: import.meta.env.VITE_AUTH0_DOMAIN,
      clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
      authorizationParams: {
        redirect_uri: import.meta.env.VITE_AUTH0_REDIRECT_URI,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: import.meta.env.VITE_AUTH0_SCOPE,
      },
    })
  )
  .mount('#app')
