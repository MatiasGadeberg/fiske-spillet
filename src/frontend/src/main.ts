import './assets/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// @ts-ignore
app.use(createPinia())
// @ts-ignore
app.use(router)

app.mount('#app')
