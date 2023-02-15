<script setup lang="ts">
import AddButton from '../components/AddButton.vue'
import ProgressItem from '@/components/Progress/ProgressItem.vue'
import { computed, ref } from 'vue'
import * as progressApi from '@/database/progress'
import CourseSetting from '@/components/Course/CourseSetting.vue'
import FetchComponent from '@/components/Others/FetchComponent.vue'
import { useCustomRouter } from '@/utils/useCustomRouter'
import { fetch } from '@/database/course'
import ListItems from '@/components/Others/ListItems.vue'
import { useFetchData } from '@/composables/useFetchData'
import { errorMsg } from '@/utils/useMessage'
import type {
	CourseWithProgress,
	Progress,
	UpdateCourse,
	UpdateProgress
} from 'shared'
import router from '@/router'
import BaseDialog from '../components/Others/BaseDialog.vue'
import * as courseApi from '../database/course'
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
		settingVisible.value = false
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
	if (course.value === undefined) return
	activeProgress.value = findById(course.value.progresses, _id) ?? null
}

async function handleProgressUpdate(
	progressId: string,
	updateProgress: UpdateProgress
) {
	try {
		if (course.value === undefined) return
		const res = await progressApi.update(progressId, updateProgress)
		findByIdAndUpdate(course.value.progresses, res)

		if (!res.isDue) course.value.dueCount--
		progressFormVisible.value = false
	} catch {
		errorMsg('Updation failed.')
	}
}

async function handleProgressDel(progressId: string) {
	try {
		if (course.value === undefined) return
		await progressApi.del(progressId)
		findByIdAndDeleteAndCalcOrder(course.value.progresses, progressId)
		course.value.progressCount--

		progressFormVisible.value = false
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
			v-if="course"
			:progress="activeProgress"
			:intervals="course.intervals"
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
		<FetchComponent :loading="loading" :error="error" :data="course">
			<!-- todo implement a generic typed component so data here has the correct type  -->
			<template #data="{ data: course }">
				<BaseDialog
					v-model="settingVisible"
					:title="$t('course.setting')"
				>
					<CourseSetting
						:course="course"
						@update="handleUpdateCourse"
						@cancel="settingVisible = false"
					>
						<template #actions>
							<DeleteButton
								:name="course.name"
								@delete="handleDelCourse"
							/>
						</template>
					</CourseSetting>
				</BaseDialog>
				<ListItems
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
							:intervals="course.intervals"
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
