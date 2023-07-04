import './assets/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useMqttStore } from './stores/mqtt'

const app = createApp({
  extends: App,
  created() {
    console.log('created OK')
    window.addEventListener('beforeunload', this.leaving)
  },
  methods: {
    leaving() {
      const mqtt = useMqttStore()
      mqtt.publishPlayerLeft()
    }
  }
})

app.use(createPinia())
app.use(router)

app.mount('#app')
