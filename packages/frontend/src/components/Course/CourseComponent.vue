<script setup lang="ts">
import type { Course } from 'shared'

defineProps<{
	courses: Course[]
}>()
</script>

<template>
	<slot />
</template>

<style scoped></style>
