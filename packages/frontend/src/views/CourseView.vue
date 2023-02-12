<script setup lang="ts">
import AddButton from '../components/AddButton.vue'
import ProgressItem from '@/components/Progress/ProgressItem.vue'
import { ref } from 'vue'
import { fetchAll } from '@/database/progress'
import CourseSetting from '@/components/Course/CourseSetting.vue'
import FetchComponent from '@/components/Others/FetchComponent.vue'
import { useCustomRouter } from '@/utils/useCustomRouter'
import { fetch } from '@/database/course'
import Items from '@/components/Others/ListItems.vue'
import { useFetchData } from '@/composables/useFetchData'
import { useCourse } from '@/composables/useCourse'
import { useProgresses } from '@/composables/useProgresses'
import { errorMsg } from '@/utils/useMessage'
import type { UpdateCourse } from 'shared'
import router from '@/router'

const settingVisible = ref(false)
const { id: courseId } = useCustomRouter()

const fetchCourse = () => {
	return fetch(courseId.value, { withProgresses: true })
}

const course = ref()
const progresses = ref([])
const { loading: loading1, error: error1 } = useFetchData(fetchCourse, course)
const { loading: loading2, error: error2 } = useFetchData(
	() => fetchAll(courseId.value),
	progresses
)
const { update: updateCourse, del: delCourse } = useCourse(course)
const { create, update, handleSort } = useProgresses(progresses)

async function handleDelCourse() {
	await delCourse()
	router.push({ name: 'courses' })
}

async function handleUpdateCourse(update: UpdateCourse) {
	await updateCourse(update)
	if ('intervals' in updateCourse) {
		useFetchData(() => fetchAll(courseId.value), progresses)
	}
}

// form
const activeProgressId = ref('')

function handleOpenForm(_id: string) {
	activeProgressId.value = _id
}

function handleProgressUpdate(v: any[]) {
	try {
		update(v[0], v[1])
		activeProgressId.value = ''
	} catch {
		errorMsg('Updation failed.')
	}
}
</script>
<template>
	<div data-testid="course-view">
		<FetchComponent
			:loading="loading1 || loading2"
			:error="error1 || error2"
		>
			<template #data>
				<AddButton
					type="progress"
					@create:progress="
						(v) => {
							create(v, course._id)
						}
					"
				/>
				<CourseSetting
					v-model="settingVisible"
					:course="course"
					@update="handleUpdateCourse"
					@delete="handleDelCourse"
				/>
				<Items
					:items="progresses"
					item-key="_id"
					:title="course.name"
					:badge="progresses.length"
					sortable
					@dragend="(evt) => handleSort(evt)"
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
							@update="
								(_id, updateProgress) =>
									update(_id, updateProgress)
							"
						/>
						<ProgressForm
							:visible="activeProgressId === item._id"
							:progress="item"
							:intervals="course.intervals"
							@update="handleProgressUpdate"
						/>
					</template>
				</Items>
			</template>
		</FetchComponent>
	</div>
</template>

<style scoped></style>
