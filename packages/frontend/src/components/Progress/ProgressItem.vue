<script setup lang="ts">
import type { Progress } from 'shared'
import { computed } from 'vue'
import dayjs from 'dayjs/esm'
import { getStageString } from '../../utils/progress.utils'
import { createUnitTestIdGetter } from '@/unit/utils'

const props = defineProps<{
	progress: Progress
	intervals: number[]
}>()

const emit = defineEmits(['open:form', 'update'])

const NAME_SPACE = 'progress-item'
const getUnitTestId = createUnitTestIdGetter(NAME_SPACE)

const isDone = computed(() => props.progress.stage >= props.intervals.length)

/**
 * to next stage button
 */
async function toNextStage() {
	const newStage = Math.min(props.progress.stage + 1, props.intervals.length)
	emit('update', props.progress._id, props.progress.course, {
		stage: newStage,
		lastDate: new Date().toISOString()
	})
}

const percentage = computed(
	() =>
		`${((props.progress.stage + 1) / (props.intervals.length + 1)) * 100}%`
)
</script>

<template>
	<el-card
		shadow="always"
		v-bind="$attrs"
		class="card"
		:body-style="{ height: '100%' }"
		data-testid="progress-list-item"
		:data-test-unit="getUnitTestId('wrapper')"
		role="progress"
		:aria-label="progress.name"
	>
		<div flex flex-col justify-start h-full class="body">
			<!-- Stage -->
			<div flex items-center gap-2>
				<h4 m-0 text-xs font-thin text-warmgray-400>
					{{ $t('course.stage') }}
				</h4>
				<p m-0 font-bold>
					{{ getStageString(progress.stage, intervals.length) }}
				</p>
			</div>

			<!-- Name -->
			<div flex items-center justify-between>
				<h3 m-0 text-2xl data-testid="progress-list-item-name">
					{{ progress.name }}
				</h3>

				<div flex-grow-1 flex items-center justify-end>
					<div
						v-if="progress.isDue"
						rounded-full
						w-8
						h-8
						grid
						place-items-center
						bg-red-500
						text-xl
						text-bold
					>
						<div i-mdi-exclamation></div>
					</div>
					<div
						v-else-if="progress.stage === intervals.length"
						rounded-full
						w-8
						h-8
						grid
						place-items-center
						bg-lime-500
						text-xl
						text-bold
					>
						<div i-mdi-success></div>
					</div>
					<div
						v-else
						rounded-full
						w-8
						h-8
						grid
						place-items-center
						bg-sky-500
						text-xl
						text-bold
					>
						<div i-mdi-progress-clock></div>
					</div>
				</div>
			</div>

			<!-- Due Date -->
			<div m-0 flex items-center justify-between>
				<div flex items-center gap-2 v-if="!isDone">
					<h4 m-0 text-xs font-thin text-warmgray-400>
						{{ $t('course.dueDate') }}
					</h4>
					<time
						m-0
						text-xs
						font-normal
						block
						class="translate-y-[1px]"
						>{{
							dayjs(progress.nextDate).format('YYYY-MM-DD')
						}}</time
					>
				</div>
			</div>

			<!-- Actions -->
			<div hidden class="actions" flex items-center justify-center mt-4>
				<div w-max>
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
							aria-label="Next Stage"
							><span i-material-symbols-next-plan text-lg></span
						></el-button>
					</el-tooltip>
					<el-tooltip
						effect="dark"
						:content="$t('actions.edit')"
						placement="top"
					>
						<el-button
							@click="emit('open:form', progress._id)"
							size="small"
							data-testid="progress-list-item-edit"
							:data-test-unit="getUnitTestId('edit')"
							aria-label="Edit"
							><span i-material-symbols-edit text-lg></span
						></el-button>
					</el-tooltip>
				</div>
			</div>
		</div>
	</el-card>
</template>

<style lang="scss" scope>
.card {
	&:hover,
	&:focus-within,
	&:focus,
	&:focus-visible {
		border: 1px solid rgba(#64748b, 0.7);

		.actions {
			display: flex;
		}
	}

	position: relative;

	&::before {
		content: '';
		position: absolute;
		height: 3px;
		bottom: 0;
		background-color: #cbd5e1;
		width: v-bind('percentage');
		z-index: 99;

		html.dark & {
			background-color: #475569;
		}
	}
}
</style>
