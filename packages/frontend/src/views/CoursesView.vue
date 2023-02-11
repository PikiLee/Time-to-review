<script setup lang="ts">
import CourseCard from '@/components/Course/CourseCard.vue'
import FetchComponent from '@/components/Others/FetchComponent.vue'
import Items from '@/components/Others/ListItems.vue'
import { fetchAll, update as rawUpdate } from '@/database/course'
import { update, del } from '@/composables/useApi'
import { CourseStatus, type Course } from 'shared'
import type { SortableEvent } from 'sortablejs'
import AddButton from '../components/AddButton.vue'
import { handleSort as rawHandleSort } from '../composables/useSort'
import { ref } from 'vue'

const courses = ref<Course[]>([])

async function handleSort(courses: Course[], evt: SortableEvent) {
	const updated = rawHandleSort(courses, evt)
	if (updated)
		updated.forEach((course) =>
			rawUpdate(course._id, {
				order: course.order
			})
		)
}

function findCourse(courseId: string) {
	return courses.value.find((course) => course._id === courseId)
}

async function toggleArchive(rawCourse: Course) {
	const course = findCourse(rawCourse._id)
	if (course) {
		await update(course, { archived: !course.archived })
	}
}

async function toggleStatus(rawCourse: Course) {
	const course = findCourse(rawCourse._id)
	if (course) {
		const newStatus =
			course.status === CourseStatus['In Progress']
				? CourseStatus.Done
				: CourseStatus['In Progress']
		await update(course, { status: newStatus })
	}
}

async function handleDelete(rawCourse: Course) {
	const course = findCourse(rawCourse._id)
	if (course) {
		await del(course, courses.value)
	}
}
</script>
<template>
	<div data-testid="courses-view">
		<AddButton :resource="{ type: 'course', courses }" />
		<FetchComponent :fetch-func="fetchAll" v-model:data="courses">
			<template #data="{ data: courses }">
				<div grid gap-8>
					<Items
						:items="
						courses.filter(
							(course: Course) =>
								course.status === CourseStatus['In Progress'] && course.archived !== true
						)
					"
						item-key="_id"
						title="In Progress"
						sortable
						@dragend="(evt) => handleSort(courses, evt)"
					>
						<template #item="course">
							<CourseCard
								:course="course"
								@delete="handleDelete"
								@toggle:archive="toggleArchive"
								@toggle:status="toggleStatus"
							/>
						</template>
					</Items>
					<Items
						:items="
						courses.filter(
							(course: Course) =>
								course.status === CourseStatus['Done'] && course.archived !== true
						)
					"
						item-key="_id"
						title="Done"
						sortable
						@dragend="(evt) => handleSort(courses, evt)"
					>
						<template #item="course">
							<CourseCard
								:course="course"
								@delete="handleDelete"
								@toggle:archive="toggleArchive"
								@toggle:status="toggleStatus"
							/>
						</template>
					</Items>
					<Items
						:items="
						courses.filter(
							(course: Course) =>
								course.archived === true
						)
					"
						item-key="_id"
						title="Archived"
						sortable
						@dragend="(evt) => handleSort(courses, evt)"
					>
						<template #item="course">
							<CourseCard
								:course="course"
								@delete="handleDelete"
								@toggle:archive="toggleArchive"
								@toggle:status="toggleStatus"
							/>
						</template>
					</Items>
				</div>
			</template>
		</FetchComponent>
	</div>
</template>

<style scoped></style>
