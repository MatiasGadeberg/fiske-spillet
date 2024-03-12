import './assets/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

// @ts-ignore
app.use(createPinia())
// @ts-ignore
app.use(router)

const auth = useAuthStore();
let tabClosing = false;

app.mixin({
    beforeMount() {
        window.addEventListener('beforeunload', this.handleTabClose)
    },
    beforeUnmount() {
        window.removeEventListener('beforeunload', this.handleTabClose)
    },
    methods: {
        handleTabClose(event: BeforeUnloadEvent) {
            if (tabClosing) {
                return
            }
            tabClosing = true;
            auth.logout()
            event.preventDefault()
        }
    }
})

app.mount('#app')
