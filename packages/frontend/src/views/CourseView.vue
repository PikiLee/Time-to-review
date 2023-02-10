<script setup lang="ts">
import AddButton from '../components/AddButton.vue'
import ProgressItem from '@/components/Progress/ProgressItem.vue'
import type { SortableEvent } from 'sortablejs'
import { ref } from 'vue'
import type { Progress } from 'shared'
import { update } from '@/database/progress'
import CourseSetting from '@/components/Course/CourseSetting.vue'
import FetchComponent from '@/components/Others/FetchComponent.vue'
import { useCustomRouter } from '@/utils/useCustomRouter'
import { fetch } from '@/database/course'
import Items from '@/components/Others/ListItems.vue'
import { handleSort as rawHandleSort } from '../composables/useSort'

const settingVisible = ref(false)
const { id: courseId } = useCustomRouter()

const fetchCourse = () => {
	return fetch(courseId.value, { withProgresses: true })
}

async function handleSort(progresses: Progress[], evt: SortableEvent) {
	const progress = rawHandleSort(progresses, evt)
	if (progress) {
		await update(progress._id, {
			order: progress.order
		})
	}
}
</script>
<template>
	<AddButton type="progress" />
	<div data-testid="course-view">
		<FetchComponent :fetch-func="fetchCourse">
			<template #data="{ data: course }">
				<CourseSetting v-model="settingVisible" :course="course" />
				<Items
					:items="course.progresses"
					item-key="_id"
					:title="course.name"
					sortable
					@dragend="(evt) => handleSort(course.progresses, evt)"
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
						/>
					</template>
				</Items>
			</template>
		</FetchComponent>
	</div>
</template>

<style scoped></style>
