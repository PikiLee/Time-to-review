<script setup lang="ts">
import ProgressCard from '@/components/Progress/ProgressCard.vue'
import type { CourseWithDueProgresses } from 'shared'

defineProps<{
	course: CourseWithDueProgresses
}>()
</script>

<template>
	<div mt-6 px-5>
		<div grid place-items-center>
			<el-badge :value="course.dueCount">
				<RouterLink
				link-decoration-none
				:to="{ name: 'course', params: { id: course._id } }"
				>
				<h2 m-none hover:text-lime-500>{{ course.name }}</h2>
			</RouterLink>
		</el-badge>
	</div>
		<section grid grid-cols-2 gap-6 p-4>
			<ProgressCard
				v-for="progress in course.dueProgresses"
				:key="progress._id"
				:courseId="course._id"
				:name="progress.name"
				:stage="progress.stage"
			/>
		</section>
	</div>
</template>
