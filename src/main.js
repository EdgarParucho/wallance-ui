import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const pinia = createPinia()

createApp(App)
  .use(router)
  .use(pinia)
  .use(Toast)
  .mount('#app')
