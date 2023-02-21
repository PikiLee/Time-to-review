<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
	<div @click="toggleDark()" cursor-pointer mb="0.125rem">
		<span
			text-xl
			text-warmgray-100
			i-material-symbols-dark-mode
			v-if="isDark"
		/>
		<span text-xl text-warmgray-700 i-material-symbols-light-mode v-else />
	</div>
</template>

<style scoped lang="scss"></style>
