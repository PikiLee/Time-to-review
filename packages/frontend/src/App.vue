<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import { useUserStore } from './store/user.store'

const user = JSON.parse(localStorage.getItem('user') ?? 'null')
if (user) {
	const userStore = useUserStore()
	userStore.user = user
}
</script>

<template>
	<div
		bg-warmgray-100
		min-w-full
		min-h-screen
		text-xs
		prose
		dark:prose-invert
		prose-warmgray
		dark:bg-warmgray-800
	>
		<AppHeader />
		<div w-4xl max-w-screen mx-auto px-2 gap-4>
			<RouterView />
		</div>
		<div h-30></div>
	</div>
</template>
