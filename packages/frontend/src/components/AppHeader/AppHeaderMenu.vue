<script setup lang="ts">
import { computed } from 'vue'
import AppLink from '../Links/AppLink.vue'

const props = defineProps<{
	flexDirection: 'row' | 'column'
	isLogin: boolean
}>()

const wrapperClasses = computed(() => {
	return {
		'flex-row': props.flexDirection === 'row',
		'flex-col': props.flexDirection === 'column'
	}
})
</script>

<template>
	<div :class="wrapperClasses" flex gap-4 items-center justify-around>
		<AppLink
			v-if="isLogin"
			:text="$t('header.home')"
			:to="{ name: 'home' }"
			data-testid="app-header-home"
		/>
		<AppLink
			v-if="isLogin"
			:to="{ name: 'courses' }"
			:text="$t('header.course')"
			data-testid="app-header-courses"
		/>
		<ToggleDark />
		<LangSelector />
		<UserInfo v-if="isLogin" />
		<div v-else text-xl flex gap-2>
			<AppLink :to="{ name: 'register' }" :text="$t('auth.register')" />
			<AppLink :to="{ name: 'login' }" :text="$t('auth.login')" />
		</div>
	</div>
</template>

<style scoped lang="scss"></style>
