<script setup lang="ts">
import type { Progress } from 'shared'
import { ref } from 'vue'
import dayjs from 'dayjs/esm'
import { update } from '@/database/progress'
import { errorMsg } from '@/utils/useMessage'
import { useCourseStore } from '@/store/course.store'

import { getStageString } from '../../utils/progress.utils'
import ProgressForm from './ProgressForm.vue'

const props = defineProps<{
	progress: Progress
}>()

const showEditor = ref(false)
const courseStore = useCourseStore()

/**
 * to next stage button
 */
async function toNextStage() {
	try {
		if (!courseStore.currentCourse) {
			throw new Error('Course not exists.')
		}
		const newStage = Math.min(
			props.progress.stage + 1,
			courseStore.currentCourse.intervals.length
		)
		await update(props.progress._id, { stage: newStage })
	} catch (err) {
		errorMsg(String(err))
	}
}
</script>

<template>
	<li
		grid
		grid-cols-12
		items-center
		border-b
		border-b-warmgray-300
		p-2
		gap-2
		cursor-pointer
		:class="{ 'bg-yellow-300 dark:bg-yellow-800': progress.isDue }"
		:id="progress.name"
		@click="showEditor = !showEditor"
		data-testid="progress-list-item"
		v-if="courseStore.currentCourse"
		class="progress-list-item-draggable"
	>
		<div
			class="progress-list-item-draggable-handle"
			col-span-1
			sm-col-span-1
			my-handle
			i-radix-icons-drag-handle-horizontal
			@click.prevent.stop
			text-xl
		></div>
		<h3 m-0 col-span-2 sm-col-span-2 data-testid="progress-list-item-name">
			{{ progress.name }}
		</h3>
		<div col-span-3 sm-col-span-2 data-testid="progress-list-item-stage">
			{{
				getStageString(
					progress.stage,
					courseStore.currentCourse?.intervals.length
				)
			}}
		</div>
		<time
			col-span-3
			sm-col-span-2
			data-testid="progress-list-item-lastDate"
		>
			{{ dayjs(progress.lastDate).format('YYYY-MM-DD') }}
		</time>
		<time col-span-3 sm-col-span-2>{{
			progress.nextDate
				? dayjs(progress.nextDate).format('YYYY-MM-DD')
				: ''
		}}</time>
		<div col-span-12 sm-col-span-3 grid place-items-center>
			<el-tooltip
				class="box-item"
				effect="dark"
				:content="$t('course.nextStage')"
				placement="top"
				v-if="
					progress.stage < courseStore.currentCourse.intervals.length
				"
			>
				<el-button @click.stop="toNextStage" size="small"
					><span i-material-symbols-next-plan mr-2></span
					>{{ $t('course.nextStage') }}</el-button
				>
			</el-tooltip>
		</div>

		<ProgressForm
			:progress="progress"
			:intervals="courseStore.currentCourse.intervals"
		/>
	</li>
</template>
