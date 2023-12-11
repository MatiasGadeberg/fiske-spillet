import './assets/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './i18n'

const app = createApp({
  extends: App,
  created() {
    console.log('created OK')
    window.addEventListener('beforeunload', this.leaving)
  },
}).use(i18n)

app.use(createPinia())
app.use(router)

app.mount('#app')
