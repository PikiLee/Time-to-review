import { defineStore } from 'pinia'
import type { User } from 'shared'
import { computed, ref, watch } from 'vue'

export const useUserStore = defineStore('user', () => {
	const user = ref<User | null>(null)

	const isLogin = computed(() => !!user.value)

	watch(user, (user) => {
		if (user) {
			localStorage.setItem('user', JSON.stringify(user))
		}
	})

	return { user, isLogin }
})
