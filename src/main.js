import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import JsonExcel from "vue-json-excel3";
const pinia = createPinia()

createApp(App)
  .component("downloadExcel", JsonExcel)
  .use(router)
  .use(pinia)
  .use(Toast)
  .mount('#app')
