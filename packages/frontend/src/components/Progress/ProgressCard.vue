<script setup lang="ts">
import { useCourseStore } from '@/store/course.store'
import { getStageString } from '@/utils/progress.utils'

const props = defineProps<{
	courseId: string
	name: string
	stage: number
}>()

const courseStore = useCourseStore()
const course = courseStore.dueCourses.find(
	(course) => course._id === props.courseId
)
</script>

<template>
	<div grid grid-rows-2 grid-cols-1 gap-2 items-center p-4 v-if="course">
		<RouterLink
			link-decoration-none
			:to="{ name: 'course', params: { id: courseId }, hash: '#' + name }"
		>
			<h3 m-0 hover:text-lime-500>{{ name }}</h3>
		</RouterLink>
		<div>
			{{ getStageString(stage, course.intervals.length) }}
		</div>
	</div>
</template>
