<script setup lang="ts">
import type { Progress } from 'shared'
import { computed, ref } from 'vue'
import dayjs from 'dayjs/esm'
import { update } from '@/database/progress'
import { errorMsg, successMsg } from '@/utils/useMessage'
import { getStageString } from '../../utils/progress.utils'
import ProgressForm from './ProgressForm.vue'
import { createUnitTestIdGetter } from '@/unit/utils'

const props = defineProps<{
	progress: Progress
	intervals: number[]
}>()

const NAME_SPACE = 'progress-item'
const getUnitTestId = createUnitTestIdGetter(NAME_SPACE)
const showEditor = ref(false)

const isDone = computed(() => props.progress.stage >= props.intervals.length)

/**
 * to next stage button
 */
async function toNextStage() {
	try {
		const newStage = Math.min(
			props.progress.stage + 1,
			props.intervals.length
		)
		await update(props.progress._id, { stage: newStage })
		successMsg('Succeeded proceeding to next stage.')
	} catch (err) {
		errorMsg(String(err))
	}
}
</script>

<template>
	<el-card shadow="always" :data-test-unit="getUnitTestId('wrapper')">
		<div flex items-center justify-between>
			<h3 m-0 text-lg data-testid="progress-list-item-name">
				{{ progress.name }}
			</h3>
			<div>
				<el-tooltip
					effect="dark"
					:content="$t('course.nextStage')"
					placement="top"
					v-if="!isDone"
				>
					<el-button
						@click="toNextStage"
						size="small"
						:data-test-unit="getUnitTestId('next-stage')"
						><span i-material-symbols-next-plan text-lg></span
					></el-button>
				</el-tooltip>
				<el-tooltip
					effect="dark"
					:content="$t('actions.edit')"
					placement="top"
				>
					<el-button
						@click="showEditor = true"
						size="small"
						:data-test-unit="getUnitTestId('edit')"
						><span i-material-symbols-edit text-lg></span
					></el-button>
				</el-tooltip>
			</div>
		</div>
		<h4 m-0 text-xs font-thin text-warmgray-400>
			{{ $t('course.stage') }}
		</h4>
		<p m-0 text-2xl font-bold flex items-center justify-between>
			{{ getStageString(progress.stage, intervals.length) }}
			<el-tag v-if="progress.isDue" effect="dark" type="danger">
				Due
			</el-tag>
		</p>
		<div m-0 flex items-center justify-start gap-2 v-if="!isDone">
			<h4 m-0 text-xs font-thin text-warmgray-400>Due Date</h4>
			<time m-0 text-xsfont-thin block>{{
				dayjs(progress.nextDate).format('YYYY-MM-DD')
			}}</time>
		</div>
	</el-card>

	<el-dialog
		v-model="showEditor"
		title="Edit Progress"
		width="90%"
		max-w-screen-sm
		:data-test-unit="getUnitTestId('dialog')"
	>
		<ProgressForm
			:progress="progress"
			:intervals="intervals"
			@ok="showEditor = false"
		/>
	</el-dialog>
</template>
