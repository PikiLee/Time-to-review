<script setup lang="ts">
import AddButton from '../components/AddButton.vue'
import ProgressItem from '@/components/Progress/ProgressItem.vue'
import { computed, ref } from 'vue'
import * as progressApi from '@/database/progress'
import CourseSetting from '@/components/Course/CourseSetting.vue'
import FetchComponent from '@/components/Others/FetchComponent.vue'
import { useCustomRouter } from '@/utils/useCustomRouter'
import * as courseApi from '@/database/course'
import ListItems from '@/components/Others/ListItems.vue'
import { useFetchData } from '@/composables/useFetchData'
import { errorMsg } from '@/utils/useMessage'
import type { Course, Progress, UpdateCourse, UpdateProgress } from 'shared'
import router from '@/router'
import BaseDialog from '../components/Others/BaseDialog.vue'
import {
	findByIdAndDeleteAndCalcOrder,
	findByIdAndUpdate,
	findById
} from '@/utils/query'
import type { SortableEvent } from 'sortablejs'
import { handleSort } from '@/composables/useSort'
import DeleteButton from '@/components/Others/DeleteButton.vue'
import { useI18n } from 'vue-i18n'
import { messages } from 'shared'

const { t } = useI18n({
	messages: {
		en: {
			name: 'Name'
		},
		'zh-Hans': {
			name: '进度名'
		}
	},
	sharedMessages: messages
})

interface CourseAndProgresses {
	course: Course
	progresses: Progress[]
}

const settingVisible = ref(false)
const { id: courseId } = useCustomRouter()

const fetchCourseAndProgresses = () => {
	return Promise.all([
		courseApi.fetch(courseId.value),
		progressApi.fetchAll(courseId.value)
	]).then(([course, progresses]) => {
		return {
			course,
			progresses
		}
	})
}

const {
	loading,
	error,
	data: courseAndProgresses
} = useFetchData<CourseAndProgresses>(fetchCourseAndProgresses)

async function handleDelCourse() {
	if (courseAndProgresses.value === undefined) return
	await courseApi.del(courseAndProgresses.value.course._id)
	router.push({ name: 'courses' })
}

async function handleUpdateCourse(update: UpdateCourse) {
	try {
		if (courseAndProgresses.value === undefined) return
		courseAndProgresses.value.course = await courseApi.update(
			courseAndProgresses.value.course._id,
			update
		)
		settingVisible.value = false
	} catch {
		errorMsg('Updation failed.')
	}
}

// create progress form
const createFormVisible = ref(false)

async function handleProgressCreate(name: string) {
	try {
		if (courseAndProgresses.value === undefined) return
		courseAndProgresses.value.progresses.push(
			await progressApi.create(courseAndProgresses.value.course._id, {
				name,
				lastDate: new Date().toISOString()
			})
		)
		createFormVisible.value = false
	} catch {
		errorMsg(`Creation Failed.`)
	}
}

// form
const activeProgress = ref<Progress | null>(null)
const progressFormVisible = computed({
	get() {
		return activeProgress.value !== null
	},
	set(value: boolean) {
		if (value) return
		activeProgress.value = null
	}
})

function handleOpenForm(_id: string) {
	if (courseAndProgresses.value === undefined) return
	activeProgress.value =
		findById(courseAndProgresses.value.progresses, _id) ?? null
}

async function handleProgressUpdate(
	progressId: string,
	updateProgress: UpdateProgress
) {
	try {
		if (courseAndProgresses.value === undefined) return
		const res = await progressApi.update(
			courseAndProgresses.value.course._id,
			progressId,
			updateProgress
		)
		findByIdAndUpdate(courseAndProgresses.value.progresses, res)

		if (!res.isDue) courseAndProgresses.value.course.dueCount--
		progressFormVisible.value = false
	} catch {
		errorMsg('Updation failed.')
	}
}

async function handleProgressDel(progressId: string) {
	try {
		if (courseAndProgresses.value === undefined) return
		await progressApi.del(courseAndProgresses.value.course._id, progressId)
		findByIdAndDeleteAndCalcOrder(
			courseAndProgresses.value.progresses,
			progressId
		)
		courseAndProgresses.value.course.progressCount--

		progressFormVisible.value = false
	} catch {
		errorMsg('Deletion failed.')
	}
}

async function handleProgressSort(evt: SortableEvent) {
	try {
		if (!courseAndProgresses.value) return
		await handleSort(
			courseAndProgresses.value.progresses,
			evt,
			(progressId: string, updateProgress: UpdateProgress) =>
				progressApi.update(
					courseAndProgresses.value!.course._id,
					progressId,
					updateProgress
				)
		)
	} catch {
		errorMsg('Deletion failed.')
	}
}
</script>
<template>
	<AddButton
		type="info"
		:tool-tip="$t('progress.create')"
		@click="createFormVisible = true"
	/>
	<BaseDialog v-model="createFormVisible" :title="$t('progress.create')">
		<CreateForm
			:label="t('name')"
			buttonType="info"
			@ok="handleProgressCreate"
		/>
	</BaseDialog>

	<BaseDialog v-model="progressFormVisible" :title="$t('progress.update')">
		<ProgressForm
			v-if="courseAndProgresses"
			:progress="activeProgress"
			:intervals="courseAndProgresses.course.intervals"
			@update="
				(progressId: string, _courseId: string, updateProgress: UpdateProgress) =>
					handleProgressUpdate(progressId, updateProgress)
			"
			@cancel="progressFormVisible = false"
		>
			<template #actions>
				<DeleteButton
					v-if="activeProgress"
					:name="activeProgress.name"
					@delete="handleProgressDel(activeProgress!._id)"
				/>
			</template>
		</ProgressForm>
	</BaseDialog>
	<div data-testid="course-view">
		<FetchComponent
			:loading="loading"
			:error="error"
			:data="courseAndProgresses"
		>
			<!-- todo implement a generic typed component so data here has the correct type  -->
			<template #data="{ data: courseAndProgresses }">
				<BaseDialog
					v-model="settingVisible"
					:title="$t('course.setting')"
				>
					<CourseSetting
						:course="courseAndProgresses.course"
						@update="handleUpdateCourse"
						@cancel="settingVisible = false"
					>
						<template #actions>
							<DeleteButton
								:name="courseAndProgresses.course.name"
								@delete="handleDelCourse"
							/>
						</template>
					</CourseSetting>
				</BaseDialog>
				<ListItems
					:items="courseAndProgresses.progresses"
					item-key="_id"
					:title="courseAndProgresses.course.name"
					:badge="courseAndProgresses.progresses.length"
					sortable
					@dragend="handleProgressSort"
				>
					<template #actions>
						<el-tooltip
							effect="dark"
							:content="$t('course.edit')"
							placement="top-start"
						>
							<button
								i-mdi-edit
								@click="settingVisible = true"
							></button>
						</el-tooltip>
					</template>
					<!-- todo implement a generic typed ListItems component so item here has the correct type  -->
					<template #item="{ item }">
						<ProgressItem
							:progress="item"
							:intervals="courseAndProgresses.course.intervals"
							@open:form="handleOpenForm"
							@update="(progressId: string, _courseId: string, updateProgress: UpdateProgress) =>
							handleProgressUpdate(progressId, updateProgress)"
						/>
					</template>
				</ListItems>
			</template>
		</FetchComponent>
	</div>
</template>

<style scoped></style>
