

import './assets/main.css'
import './index.css'

import Notifications from 'notiwind'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import VueTelegram from 'vue-tg'
import Vue3Marquee from 'vue3-marquee'
import App from './App.vue'
import router from './router'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(VueTelegram)
  .use(Notifications)
  .use(Vue3Marquee)

  .mount('#app')
