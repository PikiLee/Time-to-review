<script setup lang="ts">
import { type ProgressStage, ProgressStageObjectReversed } from 'shared'

defineProps<{
	courseId: string
	name: string
	stage: ProgressStage
}>()
</script>

<template>
	<div grid grid-rows-2 grid-cols-1 gap-2 items-center p-4>
		<RouterLink
			link-decoration-none
			:to="{ name: 'course', params: { id: courseId }, hash: '#' + name }"
		>
			<h3 m-0 hover:text-lime-500>{{ name }}</h3>
		</RouterLink>
		<div>
			{{ ProgressStageObjectReversed[stage] }}
		</div>
	</div>
</template>
