<script setup lang="ts">
import AddButton from '@/components/AddButton.vue'
import DueCourseSection from '@/components/Course/DueCourseSection.vue'

import { useCourseStore } from '@/store/course.store'

const courseStore = useCourseStore()
</script>

<template>
	<AddButton />
	<main>
		<h2 text-center>{{$t('home.title')}}</h2>
		<DueCourseSection
			v-for="course in courseStore.dueCourses"
			:key="course._id"
			:course="course"
		/>
		<el-empty
			:description="$t('common.empty')"
			v-if="courseStore.dueCourses.length === 0"
		/>
	</main>
</template>
