import { useUserStore } from '@/store/user.store'
import axios from 'axios'

export const api = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_BASEURL,
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true
})

api.interceptors.response.use(
	function (response) {
		// Any status code that lie within the range of 2xx cause this function to trigger
		// Do something with response data
		// if (response.headers["set-cookie"]) {
		// 	localStorage.setItem("cookie", response.headers["set-cookie"]);
		// }
		return response
	},
	function (error) {
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		// Do something with response error
		if (error.response.status === 401) {
			const userStore = useUserStore()
			userStore.user = null
			localStorage.removeItem('user')
		}
		return Promise.reject(error)
	}
)
