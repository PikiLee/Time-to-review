<script setup lang="ts">
import CourseCard from '@/components/Course/CourseCard.vue'
import FetchComponent from '@/components/Others/FetchComponent.vue'
import Items from '@/components/Others/ListItems.vue'
import * as courseApi from '@/database/course'
import { CourseStatus, type Course } from 'shared'
import AddButton from '../AddButton.vue'
import { computed, onMounted, ref } from 'vue'
import { useFetchData } from '@/composables/useFetchData'
import { useRoute } from 'vue-router'
import CreateForm from '../CreateForm.vue'
import BaseDialog from '../Others/BaseDialog.vue'
import { errorMsg } from '@/utils/useMessage'
import { findById, findByIdAndDeleteAndCalcOrder } from '@/utils/query'
import { calcOrder } from '@/composables/useSort'
import type { SortableEvent } from 'sortablejs'

const route = useRoute()
const formVisible = ref(false)

onMounted(() => {
	if (route.query.openAddButton) {
		formVisible.value = true
	}
})

const courses = ref<Course[]>([])
const { loading, error } = useFetchData<Course[]>(courseApi.fetchAll, courses)

const coursesInprogress = computed(() => {
	return {
		title: 'In Progress',
		items: courses.value.filter(
			(item) =>
				item.status === CourseStatus['In Progress'] && !item.archived
		)
	}
})

const coursesDone = computed(() => ({
	title: 'Done',
	items: courses.value.filter(
		(item) => item.status === CourseStatus['Done'] && !item.archived
	)
}))

const coursesArchived = computed(() => ({
	title: 'Archived',
	items: courses.value.filter((item) => item.archived)
}))
const courseByCatogry = computed(() => [
	coursesInprogress.value,
	coursesDone.value,
	coursesArchived.value
])

async function handleCreate(name: string) {
	try {
		const newCourse = courseApi.withCourseDefaults(name)
		courses.value.push(await courseApi.create(newCourse))
		formVisible.value = false
	} catch {
		errorMsg('Creation failed.')
	}
}

async function handleDel(_id: string) {
	try {
		await courseApi.del(_id)
		findByIdAndDeleteAndCalcOrder(courses.value, _id)
	} catch {
		errorMsg('Deletion failed.')
	}
}

async function handleToggleStatus(_id: string) {
	try {
		const item = findById(courses.value, _id)
		if (!item) throw Error('Not found.')

		const order = courses.value.length - 1
		calcOrder(item.order, order, courses.value)

		const newStatus =
			item.status === CourseStatus['In Progress']
				? CourseStatus.Done
				: CourseStatus['In Progress']
		await courseApi.update(item._id, { status: newStatus, order })
		item.status = newStatus
	} catch {
		errorMsg('Toggle status failed.')
	}
}

async function handleToggleArchive(_id: string) {
	try {
		const item = findById(courses.value, _id)
		if (!item) throw Error('Not found.')

		const order = courses.value.length - 1
		calcOrder(item.order, order, courses.value)

		await courseApi.update(item._id, {
			archived: !item.archived,
			order
		})
		item.archived = !item.archived
	} catch (err) {
		errorMsg('Toggle archived failed.')
	}
}

async function handleCourseSort(items: Course[], evt: SortableEvent) {
	try {
		if (
			evt.oldDraggableIndex !== undefined &&
			evt.newDraggableIndex !== undefined
		) {
			const item = items[evt.oldDraggableIndex]
			const fromInex = item.order
			const toIndex = items[evt.newDraggableIndex].order
			await courseApi.update(item._id, {
				order: evt.newDraggableIndex
			})

			calcOrder(fromInex, toIndex, courses.value)
		}
	} catch {
		errorMsg('Deletion failed.')
	}
}
</script>
<template>
	<AddButton
		type="primary"
		tool-tip="Create Course"
		@click="formVisible = true"
	/>
	<BaseDialog v-model="formVisible" title="Create Course">
		<CreateForm label="Course Name" @ok="handleCreate" />
	</BaseDialog>
	<FetchComponent :loading="loading" :error="error">
		<template #data>
			<div grid gap-8>
				<Items
					v-for="coursesCategoried in courseByCatogry"
					:key="coursesCategoried.title"
					:items="coursesCategoried.items"
					item-key="_id"
					:title="coursesCategoried.title"
					sortable
					@dragend="
						(evt) => handleCourseSort(coursesCategoried.items, evt)
					"
				>
					<template #item="course">
						<CourseCard
							:course="course"
							@delete="handleDel"
							@toggle:archive="handleToggleArchive"
							@toggle:status="handleToggleStatus"
						/>
					</template>
				</Items>
			</div>
		</template>
	</FetchComponent>
</template>

<style scoped></style>
