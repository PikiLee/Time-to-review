<script setup lang="ts">
import { useUserStore } from '@/store/user.store'
import * as authApi from '@/database/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
function logout() {
	authApi.logout().finally(() => {
		userStore.user = null
		localStorage.removeItem('user')
		router.push({ name: 'login' })
	})
}
</script>

<template>
	<el-popover placement="bottom" trigger="hover" v-if="userStore.user">
		<div>
			<el-button
				text
				w-full
				data-testid="app-header-logout"
				@click="logout"
				>{{ $t('auth.logout') }}</el-button
			>
		</div>
		<template #reference>
			<div data-testid="app-header-username" role="logginedUsername">
				{{ userStore.user.username }}
			</div>
		</template>
	</el-popover>
</template>

<style scoped lang="scss"></style>
