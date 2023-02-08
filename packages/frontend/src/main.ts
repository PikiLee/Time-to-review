import { createApp, h } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { i18n } from './i18n'

import 'uno.css'
import '@unocss/reset/antfu.css'
import './assets/element.scss'
import './assets/main.css'
import { useUserStore } from './store/user.store'

const app = createApp({
	created() {
		const user = JSON.parse(localStorage.getItem('user') ?? 'null')
		if (user) {
			const userStore = useUserStore()
			userStore.user = user
		}
	},
	render: () => h(App)
})
const pinia = createPinia()

app.use(router).use(i18n).use(pinia)

app.mount('#app')
