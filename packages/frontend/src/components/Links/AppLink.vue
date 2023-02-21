<script setup lang="ts">
defineProps<{
	/**
	 * The link text
	 */
	text: string
	/**
	 * The link route name
	 */
	to: string
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
