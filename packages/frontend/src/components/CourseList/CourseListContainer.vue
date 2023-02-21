<script setup lang="ts">
import CourseCard from '@/components/Course/CourseCard.vue'
import FetchComponent from '@/components/Others/FetchComponent.vue'
import Items from '@/components/Others/ListItems.vue'
import * as courseApi from '@/database/course'
import { CourseStatus, type Course } from 'shared'
import AddButton from '../Buttons/AddButton.vue'
import { computed, onMounted, ref } from 'vue'
import { useFetchData } from '@/composables/useFetchData'
import { useRoute } from 'vue-router'
import CreateForm from '../CreateForm.vue'
import BaseDialog from '../Others/BaseDialog.vue'
import { errorMsg } from '@/utils/useMessage'
import { findById, findByIdAndDeleteAndCalcOrder } from '@/utils/query'
import { calcOrder } from '@/composables/useSort'
import type { SortableEvent } from 'sortablejs'
import { useI18n } from 'vue-i18n'
import { messages } from 'shared'

const { t } = useI18n({
	messages: {
		en: {
			title: 'All Courses',
			inProgress: 'In Progress',
			done: 'Done',
			archived: 'Archived',
			name: 'Course Name'
		},
		'zh-Hans': {
			title: '所有课程',
			inProgress: '进行中',
			done: '已完成',
			archived: '已归档',
			name: '课程名'
		}
	},
	sharedMessages: messages
})

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
		title: t('inProgress'),
		items: courses.value.filter(
			(item) =>
				item.status === CourseStatus['In Progress'] && !item.archived
		)
	}
})

const coursesDone = computed(() => ({
	title: t('done'),
	items: courses.value.filter(
		(item) => item.status === CourseStatus['Done'] && !item.archived
	)
}))

const coursesArchived = computed(() => ({
	title: t('archived'),
	items: courses.value.filter((item) => item.archived)
}))
const courseByCatogry = computed(() => [
	coursesInprogress.value,
	coursesDone.value,
	coursesArchived.value
])

async function handleCreate(name: string) {
	try {
		courses.value.push(await courseApi.create({ name }))
		formVisible.value = false
	} catch {
		errorMsg(t('errors.createFail', [t('course.name')]))
	}
}

async function handleDel(_id: string) {
	try {
		await courseApi.del(_id)
		findByIdAndDeleteAndCalcOrder(courses.value, _id)
	} catch {
		errorMsg(t('errors.notExist', [t('course.cap')]))
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
	} catch (err: any) {
		if (err.response.status === 404) {
			errorMsg(t('errors.notExist', [t('course.cap')]))
		} else if (err.response.status === 400) {
			errorMsg(t('errors.updateFail', [t('course.name')]))
		}
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
	} catch (err: any) {
		if (err.response.status === 404) {
			errorMsg(t('errors.notExist', [t('course.cap')]))
		} else if (err.response.status === 400) {
			errorMsg(t('errors.updateFail', [t('course.name')]))
		}
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
		errorMsg(t('errors.updateFail'))
	}
}

// tabs
const activeName = ref(t('inProgress'))
</script>
<template>
	<AddButton
		type="primary"
		:tool-tip="t('course.create')"
		@click="formVisible = true"
	/>
	<BaseDialog v-model="formVisible" :title="t('course.create')">
		<CreateForm :label="t('name')" @ok="handleCreate" />
	</BaseDialog>
	<h2 text-center text-3xl>{{ t('title') }}</h2>
	<FetchComponent :loading="loading" :error="error">
		<template #data>
			<el-tabs v-model="activeName" type="card">
				<el-tab-pane
					:label="coursesCategoried.title"
					:name="coursesCategoried.title"
					v-for="coursesCategoried in courseByCatogry"
					:key="coursesCategoried.title"
					><Items
						:items="coursesCategoried.items"
						item-key="_id"
						:title="coursesCategoried.title"
						sortable
						@dragend="
							(evt) =>
								handleCourseSort(coursesCategoried.items, evt)
						"
					>
						<template #item="{ item: course }">
							<CourseCard
								:course="course"
								@delete="handleDel"
								@toggle:archive="handleToggleArchive"
								@toggle:status="handleToggleStatus"
							/>
						</template> </Items
				></el-tab-pane>
			</el-tabs>
		</template>
	</FetchComponent>
</template>

<style scoped></style>
