import './assets/main.css'
import './index.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueTelegram from 'vue-tg'
import Notifications from 'notiwind'
import Vue3Marquee from 'vue3-marquee'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(VueTelegram)
  .use(Notifications)
  .use(Vue3Marquee)
  .mount('#app')
