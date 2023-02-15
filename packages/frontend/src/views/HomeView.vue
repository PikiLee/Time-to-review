<script setup lang="ts">
import FetchComponent from '@/components/Others/FetchComponent.vue'
import ListItems from '@/components/Others/ListItems.vue'
import ProgressItem from '@/components/Progress/ProgressItem.vue'
import { useFetchData } from '@/composables/useFetchData'
import { fetchDue } from '@/database/course'
import * as progressApi from '@/database/progress'
import {
	findById,
	findByIdAndDelete,
	findByIdAndDeleteAndCalcOrder,
	findByIdAndUpdate,
	findByIdOrError
} from '@/utils/query'
import { errorMsg } from '@/utils/useMessage'
import type { CourseWithDueProgresses, Progress, UpdateProgress } from 'shared'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { messages } from 'shared'

const { t } = useI18n({
	messages: {
		en: {
			title: 'Start Review!',
			congradulation: 'Congradulations! No Courses Need Rewiew!',
			goAdd: 'Go Add One!'
		},
		'zh-Hans': {
			title: '开始复习吧',
			congradulation: '恭喜! 没有需要复习的课程',
			goAdd: '去添加一个吧!'
		}
	},
	sharedMessages: messages
})

const router = useRouter()

const {
	data: courses,
	loading,
	error
} = useFetchData<CourseWithDueProgresses[]>(() =>
	fetchDue({ withDueProgresses: true })
)

function goAddCourse() {
	router.push({ name: 'courses', query: { openAddButton: 'true' } })
}

// form
const activeProgress = ref<Progress | null>(null)
const activeCourse = ref<CourseWithDueProgresses | null>(null)
const progressFormVisible = computed({
	get() {
		return activeProgress.value !== null && activeCourse.value !== null
	},
	set(value: boolean) {
		if (value) return
		activeProgress.value = null
		activeCourse.value = null
	}
})

function handleOpenForm(courseId: string, progressId: string) {
	if (!courses.value) return
	const course = findById(courses.value, courseId)

	if (!course) return
	activeCourse.value = course
	activeProgress.value = findById(course.dueProgresses, progressId) ?? null
}

async function handleProgressDel() {
	try {
		if (!courses.value) throw Error()
		if (!activeCourse.value) throw Error()
		if (!activeProgress.value) throw Error()
		await progressApi.del(activeProgress.value._id)
		findByIdAndDeleteAndCalcOrder(
			activeCourse.value.dueProgresses,
			activeProgress.value._id
		)
		activeCourse.value.dueCount--

		if (activeCourse.value.dueProgresses.length === 0)
			findByIdAndDelete(courses.value, activeCourse.value._id)
		progressFormVisible.value = false
	} catch {
		errorMsg(t('message.fail'))
	}
}

async function handleProgressUpdate(
	progressId: string,
	courseId: string,
	update: UpdateProgress
) {
	try {
		if (!courses.value) throw Error()
		const course = findByIdOrError(courses.value, courseId)
		const progress = findByIdOrError(course.dueProgresses, progressId)
		const updatedProgress = await progressApi.update(progress._id, update)

		if (!updatedProgress.isDue) {
			findByIdAndDeleteAndCalcOrder(course.dueProgresses, progress._id)
			course.dueCount--

			if (course.dueProgresses.length === 0)
				findByIdAndDelete(courses.value, course._id)
		} else {
			findByIdAndUpdate(course.dueProgresses, updatedProgress)
		}

		progressFormVisible.value = false
	} catch {
		errorMsg(t('message.fail'))
	}
}
</script>

<template>
	<main>
		<h2 text-center text-3xl data-testid="home-view-title">
			{{ t('title') }}
		</h2>
		<BaseDialog v-model="progressFormVisible" title="Update Progress">
			<ProgressForm
				v-if="activeCourse"
				:progress="activeProgress"
				:intervals="activeCourse.intervals"
				@update="handleProgressUpdate"
				@cancel="progressFormVisible = false"
			>
				<template #actions>
					<DeleteButton
						v-if="activeProgress && activeCourse"
						:name="activeProgress.name"
						@delete="handleProgressDel"
					/>
				</template>
			</ProgressForm>
		</BaseDialog>
		<FetchComponent :loading="loading" :error="error">
			<template #data>
				<div flex flex-col gap-8>
					<ListItems
						v-for="course in courses"
						:key="course._id"
						:items="course.dueProgresses"
						:title="course.name"
						:badge="course.dueCount"
						item-key="_id"
						badgeType="danger"
					>
						<template #item="{ item }">
							<ProgressItem
								:progress="item"
								:intervals="course.intervals"
								@open:form="
									handleOpenForm(course._id, item._id)
								"
								@update="handleProgressUpdate"
							/>
						</template>
					</ListItems>
				</div>
			</template>
		</FetchComponent>
		<div v-if="courses && courses.length === 0">
			<el-empty :description="t('congradulation')" />
			<div flex items-center justify-center>
				<el-button type="primary" @click="goAddCourse">{{
					t('goAdd')
				}}</el-button>
			</div>
		</div>
	</main>
</template>
