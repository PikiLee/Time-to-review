<script setup lang="ts">
import type { CourseWithDueProgresses } from 'shared'
import ProgressItem from '../Progress/ProgressItem.vue'

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
			<ProgressItem
				v-for="progress in course.dueProgresses"
				:key="progress._id"
				:progress="progress"
				:intervals="course.intervals"
			/>
		</section>
	</div>
</template>
