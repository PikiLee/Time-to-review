<script setup lang="ts">
import DueCourseSection from '@/components/Course/DueCourseSection.vue'

import { useCourseStore } from '@/store/course.store'

const courseStore = useCourseStore()
</script>

<template>
	<main>
		<h2 text-center>Courses that need review</h2>
		<DueCourseSection
			v-for="course in courseStore.dueCourses"
			:key="course._id"
			:course="course"
		/>
		<el-empty
			description="No courses need review yet."
			v-if="courseStore.dueCourses.length === 0"
		/>
	</main>
</template>
