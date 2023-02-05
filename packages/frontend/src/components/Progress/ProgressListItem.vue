<script setup lang="ts">
import {
	progressStageIndices,
	ProgressStageObject,
	ProgressStageObjectReversed,
	type Progress,
	type UpdateProgress
} from 'shared'
import { del } from '@/database/progress'
import { ref, reactive, watchEffect } from 'vue'
import dayjs from 'dayjs/esm'
import type { FormInstance, FormRules } from 'element-plus'
import { update } from '@/database/progress'
import { errorMsg, successMsg } from '@/utils/useMessage'

const props = defineProps<{
	progress: Progress
}>()

const showEditor = ref(false)
const ruleFormRef = ref<FormInstance>()
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
				return value in progressStageIndices
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
	>
		<h3 m-0 col-span-3 data-testid="progress-list-item-name">
			{{ progress.name }}
		</h3>
		<div col-span-3 data-testid="progress-list-item-stage">
			{{ ProgressStageObjectReversed[progress.stage] }}
		</div>
		<time col-span-3 data-testid="progress-list-item-lastDate">
			{{ dayjs(progress.lastDate).format('YYYY-MM-DD') }}
		</time>
		<time col-span-3>{{ progress.nextDate }}</time>
	</li>

	<el-form
		ref="ruleFormRef"
		:model="ruleForm"
		:rules="rules"
		label-width="200px"
		label-position="left"
		status-icon
		v-if="showEditor"
		mt-6
	>
		<el-form-item label="Progress name" prop="name">
			<el-input
				v-model="ruleForm.name"
				data-testid="progress-list-item-name-input"
			/>
		</el-form-item>
		<el-form-item label="Stage" prop="region">
			<el-select v-model="ruleForm.stage">
				<el-option
					v-for="(value, key) in ProgressStageObject"
					:key="key"
					:label="key"
					:value="value"
				/>
			</el-select>
		</el-form-item>
		<el-form-item label="Last Review Date" prop="count">
			<el-date-picker
				v-model="ruleForm.lastDate"
				type="date"
				placeholder="Pick a day"
				:style="{ width: '100%' }"
				:clearable="false"
			/>
		</el-form-item>

		<el-form-item>
			<el-button
				type="primary"
				@click="submitForm(ruleFormRef)"
				data-testid="progress-list-item-confirm"
			>
				Confirm
			</el-button>
			<el-button
				@click="del(progress._id)"
				data-testid="progress-list-item-delete"
				>Delete</el-button
			>
		</el-form-item>
	</el-form>
</template>
