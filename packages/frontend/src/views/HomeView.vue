<script setup lang="ts">
import AddButton from '@/components/AddButton.vue'
import DueCourseSection from '@/components/Course/DueCourseSection.vue'

import { useCourseStore } from '@/store/course.store'

const courseStore = useCourseStore()
</script>

<template>
	<AddButton type="course" />
	<main>
		<h2 text-center text-3xl data-testid="home-view-title">
			{{ $t('home.title') }}
		</h2>
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
