<script setup lang="ts">
import CourseCard from '@/components/Course/CourseCard.vue'
import { useCourseStore } from '@/store/course.store'
import AddButton from '../components/AddButton.vue'

const courseStore = useCourseStore()
</script>
<template>
	<AddButton />
	<div data-testid="courses-view">
		<h2 text-center>{{$t('courses.title')}}</h2>
		<ul list-none>
			<li data-testid="courses-view-in-progress-courses">
				<h3 text-center>{{$t('courses.inProgress')}}</h3>
				<ul
					list-none
					grid
					grid-cols-2
					gap-6
					p-4
					v-if="courseStore.coursesInProgress.length"
				>
					<CourseCard
						:course="course"
						v-for="course in courseStore.coursesInProgress"
						:key="course._id"
					/>
				</ul>
				<el-empty v-else description="No courses in progress yet." />
			</li>
			<li data-testid="courses-view-done-courses">
				<h2 text-center>{{$t('courses.done')}}</h2>
				<ul
					list-none
					grid
					grid-cols-2
					gap-6
					p-4
					v-if="courseStore.coursesDone.length"
				>
					<CourseCard
						:course="course"
						v-for="course in courseStore.coursesDone"
						:key="course._id"
					/>
				</ul>
				<el-empty v-else description="No courses have been done yet." />
			</li>
			<li data-testid="courses-view-archived-courses">
				<h2 text-center>{{$t('courses.archived')}}</h2>
				<ul
					list-none
					grid
					grid-cols-2
					gap-6
					p-4
					v-if="courseStore.coursesArchived.length"
				>
					<CourseCard
						:course="course"
						v-for="course in courseStore.coursesArchived"
						:key="course._id"
					/>
				</ul>
				<el-empty v-else description="No courses have been archived yet." />
			</li>
		</ul>
	</div>
</template>

<style scoped></style>
