<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
	/**
	 * The link text
	 */
	text: string
	/**
	 * The link route name
	 */
	to: RouteLocationRaw
}>()
</script>

<template>
	<RouterLink
		font-600
		text-lg
		link-decoration-none
		hover:text-lime-500
		:to="to"
		data-testid="app-header-home"
		>{{ text }}</RouterLink
	>
</template>

<style scoped lang="scss"></style>
