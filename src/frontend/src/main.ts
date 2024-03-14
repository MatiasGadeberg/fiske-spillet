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
let isTabHidden = false;

app.mixin({
    beforeMount() {
        window.addEventListener('beforeunload', this.handleTabClose)
        window.addEventListener('visibilitychange', this.handleVisibilityChange)
    },
    beforeUnmount() {
        window.removeEventListener('beforeunload', this.handleTabClose)
        window.removeEventListener('visibilitychange', this.handleVisibilityChange)
    },
    methods: {
        handleVisibilityChange() {
            if (document.visibilityState === 'hidden') {
                isTabHidden = true
            }
        },
        handleTabClose(event: BeforeUnloadEvent) {
            if (tabClosing || isTabHidden) {
                return
            }
            tabClosing = true;
            auth.logout()
            event.preventDefault()
        }
    }
})

app.mount('#app')
