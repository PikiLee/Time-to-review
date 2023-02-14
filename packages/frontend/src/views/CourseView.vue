<script setup lang="ts">
import AddButton from '../components/AddButton.vue'
import ProgressItem from '@/components/Progress/ProgressItem.vue'
import { ref } from 'vue'
import * as progressApi from '@/database/progress'
import CourseSetting from '@/components/Course/CourseSetting.vue'
import FetchComponent from '@/components/Others/FetchComponent.vue'
import { useCustomRouter } from '@/utils/useCustomRouter'
import { fetch } from '@/database/course'
import Items from '@/components/Others/ListItems.vue'
import { useFetchData } from '@/composables/useFetchData'
import { errorMsg } from '@/utils/useMessage'
import type { CourseWithProgress, UpdateCourse, UpdateProgress } from 'shared'
import router from '@/router'
import BaseDialog from '../components/Others/BaseDialog.vue'
import * as courseApi from '../database/course'
import { findByIdAndDeleteAndCalcOrder, findByIdAndUpdate } from '@/utils/query'
import type { SortableEvent } from 'sortablejs'
import { handleSort } from '@/composables/useSort'

const settingVisible = ref(false)
const { id: courseId } = useCustomRouter()

const fetchCourse = () => {
	return fetch(courseId.value, { withProgresses: true })
}

const {
	loading,
	error,
	data: course
} = useFetchData<CourseWithProgress>(fetchCourse)

async function handleDelCourse() {
	if (course.value === undefined) return
	await courseApi.del(course.value._id)
	router.push({ name: 'courses' })
}

async function handleUpdateCourse(update: UpdateCourse) {
	try {
		if (course.value === undefined) return
		course.value = await courseApi.update(course.value._id, update, {
			withProgresses: true
		})
	} catch {
		errorMsg('Updation failed.')
	}
}

// create progress form
const createFormVisible = ref(false)

async function handleProgressCreate(name: string) {
	try {
		if (course.value === undefined) return
		const newProgress = progressApi.withProgressDefaults(
			name,
			course.value._id
		)
		course.value.progresses.push(await progressApi.create(newProgress))
		createFormVisible.value = false
	} catch {
		errorMsg(`Creation Failed.`)
	}
}

// form
const activeProgressId = ref('')

function handleOpenForm(_id: string) {
	activeProgressId.value = _id
}

async function handleProgressUpdate(
	_id: string,
	updateProgress: UpdateProgress
) {
	try {
		if (course.value === undefined) return
		const res = await progressApi.update(_id, updateProgress)
		findByIdAndUpdate(course.value.progresses, res)
		activeProgressId.value = ''
	} catch {
		errorMsg('Updation failed.')
	}
}

async function handleProgressDel(_id: string) {
	try {
		if (course.value === undefined) return
		await progressApi.del(_id)
		findByIdAndDeleteAndCalcOrder(course.value.progresses, _id)
		activeProgressId.value = ''
	} catch {
		errorMsg('Deletion failed.')
	}
}

async function handleProgressSort(evt: SortableEvent) {
	if (course.value === undefined) return
	try {
		await handleSort(course.value?.progresses, evt, progressApi.update)
	} catch {
		errorMsg('Deletion failed.')
	}
}
</script>
<template>
	<AddButton
		type="info"
		tool-tip="Create Progress"
		@click="createFormVisible = true"
	/>
	<BaseDialog v-model="createFormVisible" title="Create Progress">
		<CreateForm
			label="Progress Name"
			buttonType="info"
			@ok="handleProgressCreate"
		/>
	</BaseDialog>
	<div data-testid="course-view">
		<FetchComponent :loading="loading" :error="error" :data="course">
			<template #data="{ data: course }">
				<CourseSetting
					v-model="settingVisible"
					:course="course"
					@update="handleUpdateCourse"
					@delete="handleDelCourse"
				/>
				<Items
					:items="course.progresses"
					item-key="_id"
					:title="course.name"
					:badge="course.progresses.length"
					sortable
					@dragend="handleProgressSort"
				>
					<template #actions>
						<el-tooltip
							effect="dark"
							:content="$t('actions.edit')"
							placement="top-start"
						>
							<button
								i-mdi-edit
								@click="settingVisible = true"
							></button>
						</el-tooltip>
					</template>
					<template #item="item">
						<ProgressItem
							:progress="item"
							:intervals="course.intervals"
							@open:form="handleOpenForm"
							@update="handleProgressUpdate"
						/>
						<ProgressForm
							:visible="activeProgressId === item._id"
							:progress="item"
							:intervals="course.intervals"
							@update="handleProgressUpdate"
							@delete="handleProgressDel"
						/>
					</template>
				</Items>
			</template>
		</FetchComponent>
	</div>
</template>

<style scoped></style>
