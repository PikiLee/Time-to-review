<script setup lang="ts">
import FetchComponent from '@/components/Others/FetchComponent.vue'
import ListItems from '@/components/Others/ListItems.vue'
import ProgressItem from '@/components/Progress/ProgressItem.vue'
import { useFetchData } from '@/composables/useFetchData'
import { fetchDue } from '@/database/course'
import * as progressApi from '@/database/progress'
import { errorMsg } from '@/utils/useMessage'
import type { CourseWithDueProgresses, UpdateProgress } from 'shared'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const {
	data: courses,
	loading,
	error
} = useFetchData<CourseWithDueProgresses[]>(() =>
	fetchDue({ withDueProgresses: true })
)

// form
const activeProgressId = ref('')

function handleOpenForm(_id: string) {
	activeProgressId.value = _id
}

async function handleProgressUpdate(
	_id: string,
	course: string,
	update: UpdateProgress
) {
	try {
		const updatedProgress = await progressApi.update(_id, update)
		if (!courses.value)
			throw Error('Course not Found in Local. Please refresh.')
		const parent = courses.value.find((c) => (c._id = course))

		if (!parent) throw Error('Course not Found in Local. Please refresh.')

		if (!updatedProgress.isDue) {
			parent.dueProgresses = parent.dueProgresses.filter(
				(p) => p._id !== _id
			)
			parent.dueCount--

			if (parent.dueProgresses.length === 0)
				courses.value = courses.value.filter((c) => c._id !== _id)
		} else {
			parent.dueProgresses = parent.dueProgresses.map((p) => {
				if (p._id === _id) return updatedProgress
				return p
			})
		}
		activeProgressId.value = ''
	} catch {
		errorMsg('Updation failed.')
	}
}

function goAddCourse() {
	router.push({ name: 'courses', query: { openAddButton: 'true' } })
}
</script>

<template>
	<main>
		<h2 text-center text-3xl data-testid="home-view-title">
			{{ $t('home.title') }}
		</h2>
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
						<template #item="item">
							<ProgressItem
								:progress="item"
								:intervals="course.intervals"
								@open:form="handleOpenForm"
								@update="
									(_id, updateProgress) =>
										handleProgressUpdate(
											_id,
											item._id,
											updateProgress
										)
								"
							/>
							<ProgressForm
								:visible="activeProgressId === item._id"
								:progress="item"
								:intervals="course.intervals"
								@update="handleProgressUpdate"
							/>
						</template>
					</ListItems>
				</div>
			</template>
		</FetchComponent>
		<div v-if="courses && courses.length === 0">
			<el-empty description="Congradulations! No Courses Need Rewiew!" />
			<div flex items-center justify-center>
				<el-button type="primary" @click="goAddCourse"
					>Go Add Course</el-button
				>
			</div>
		</div>
	</main>
</template>
