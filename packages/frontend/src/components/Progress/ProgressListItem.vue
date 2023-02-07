<script setup lang="ts">
import type { Progress, UpdateProgress } from 'shared'
import { del } from '@/database/progress'
import { ref, reactive, watchEffect } from 'vue'
import dayjs from 'dayjs/esm'
import type { FormInstance, FormRules } from 'element-plus'
import { update } from '@/database/progress'
import { errorMsg, successMsg } from '@/utils/useMessage'
import { useCourseStore } from '@/store/course.store'
import { getStageString } from '../../utils/progress.utils'

const props = defineProps<{
	progress: Progress
}>()

const showEditor = ref(false)
const ruleFormRef = ref<FormInstance>()
const courseStore = useCourseStore()
let ruleForm: UpdateProgress
watchEffect(() => {
	const copy = {
		name: props.progress.name,
		stage: props.progress.stage,
		lastDate: props.progress.lastDate,
		order: props.progress.order
	}
	ruleForm = reactive(copy)
})

const rules = reactive<FormRules>({
	name: [
		{ required: true, message: 'Please input name', trigger: 'blur' },
		{
			min: 1,
			max: 20,
			message: 'Length should be 1 to 20',
			trigger: 'blur'
		}
	],
	stage: [
		{
			required: true,
			message: 'Please select a stage',
			trigger: 'change'
		},
		{
			validator(_, value) {
				return (
					typeof value === 'number' &&
					value >= 0 &&
					courseStore.currentCourse &&
					value <= courseStore.currentCourse.intervals.length
				)
			},
			message: 'Please select a valid stage',
			trigger: 'change'
		}
	],
	lastDate: [
		{
			required: true,
			message: 'Please select last review date',
			trigger: 'change'
		}
	]
})

const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return
	await formEl.validate((valid) => {
		if (valid) {
			update(props.progress._id, ruleForm)
				.then(() => {
					successMsg('Updation succeeded.')
					showEditor.value = false
				})
				.catch((err) => {
					errorMsg(`Updation failed. ${err}`)
				})
		} else {
			errorMsg('Updation failed.')
		}
	})
}

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

		<el-form
			ref="ruleFormRef"
			:model="ruleForm"
			:rules="rules"
			label-width="200px"
			label-position="left"
			status-icon
			v-if="showEditor && courseStore.currentCourse"
			mt-6
			col-span-12
			@click.stop
		>
			<el-form-item :label="$t('course.name')" prop="name">
				<el-input
					v-model="ruleForm.name"
					data-testid="progress-list-item-name-input"
				/>
			</el-form-item>
			<el-form-item :label="$t('course.stage')" prop="stage">
				<el-select v-model="ruleForm.stage">
					<el-option
						v-for="value in courseStore.currentCourse?.intervals
							.length + 1"
						:key="value"
						:label="
							getStageString(
								value - 1,
								courseStore.currentCourse.intervals.length
							)
						"
						:value="value - 1"
					/>
				</el-select>
			</el-form-item>
			<el-form-item :label="$t('course.lastReviewDate')" prop="lastDate">
				<el-date-picker
					v-model="ruleForm.lastDate"
					type="date"
					placeholder="Pick a day"
					:style="{ width: '100%' }"
					:clearable="false"
				/>
			</el-form-item>

			<el-form-item>
				<div flex gap-2 flex-wrap>
					<el-button
						type="primary"
						@click="submitForm(ruleFormRef)"
						data-testid="progress-list-item-confirm"
						size="small"
					>
						{{ $t('actions.confirm') }}
					</el-button>
					<el-button
						@click="del(progress._id)"
						data-testid="progress-list-item-delete"
						size="small"
						>{{ $t('actions.delete') }}</el-button
					>
				</div>
			</el-form-item>
		</el-form>
	</li>
</template>
