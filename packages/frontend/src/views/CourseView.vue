<script setup lang="ts">
import AddButton from '../components/AddButton.vue'
import ProgressListItem from '@/components/Progress/ProgressListItem.vue'
import { useCourseStore } from '@/store/course.store'

const courseStore = useCourseStore()
</script>
<template>
	<AddButton />
	<div v-if="courseStore.currentCourse" data-testid="course-view">
		<h2 text-center>{{courseStore.currentCourse.name}}</h2>
		<ul list-none p-none v-if="courseStore.currentCourse.progresses.length">
			<li
				grid
				grid-cols-12
				items-center
				border-b
				border-b-warmgray-300
				p-2
				gap-2
			>
				<span col-span-3>{{$t('course.name')}}</span>
				<span col-span-3>{{$t('course.stage')}}</span>
				<span col-span-3>{{$t('course.lastReviewDate')}}</span>
				<span col-span-3>{{$t('course.nextReviewDate')}}</span>
			</li>
			<ProgressListItem
				v-for="progress in courseStore.currentCourse.progresses"
				:key="progress._id"
				:progress="progress"
			/>
		</ul>
		<el-empty v-else :description="$t('common.empty')" />
	</div>
	<el-empty :description="$t('common.empty')" v-else />
</template>

<style scoped></style>
