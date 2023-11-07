import './assets/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useTeamStore } from './stores/team'

const app = createApp({
  extends: App,
  created() {
    console.log('created OK')
    window.addEventListener('beforeunload', this.leaving)
  },
  methods: {
    async leaving() {
      const team = useTeamStore()
      await team.removePlayer()
    }
  }
})

app.use(createPinia())
app.use(router)

app.mount('#app')
