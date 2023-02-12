<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import type { Progress } from 'shared'
import { ref, reactive } from 'vue'
import { getStageString } from '../../utils/progress.utils'
import { createUnitTestIdGetter } from '@/unit/utils'

const props = defineProps<{
	visible: boolean
	progress: Progress
	intervals: number[]
}>()
const emit = defineEmits(['update', 'delete'])
const NAME_SPACE = 'progress-form'
const getUnitTestId = createUnitTestIdGetter(NAME_SPACE)

const ruleFormRef = ref<FormInstance>()
const copy = {
	name: props.progress.name,
	stage: props.progress.stage,
	lastDate: props.progress.lastDate,
	order: props.progress.order
}

let ruleForm = reactive(copy)

const rules = reactive<FormRules>({
	name: [
		{ required: true, message: 'Please input name', trigger: 'blur' },
		{
			type: 'string',
			min: 1,
			max: 60,
			message: 'Length should be 1 to 60',
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
			type: 'number',
			validator(_, value) {
				return (
					typeof value === 'number' &&
					value >= 0 &&
					value <= props.intervals.length
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
	await formEl.validate(async (valid) => {
		if (valid) {
			emit('update', [props.progress._id, ruleForm])
		}
	})
}
</script>

<template>
	<el-dialog
		:modelValue="visible"
		title="Edit Progress"
		width="90%"
		max-w-screen-sm
		:data-test-unit="getUnitTestId('wrapper')"
	>
		<el-form
			ref="ruleFormRef"
			:model="ruleForm"
			:rules="rules"
			label-width="120px"
			label-position="left"
			status-icon
			mt-6
			col-span-12
			@click.stop
			data-testid="progress-form"
			:data-test-unit="getUnitTestId('form')"
		>
			<el-form-item :label="$t('course.name')" prop="name">
				<el-input
					v-model="ruleForm.name"
					data-testid="progress-list-item-name-input"
					:data-test-unit="`${NAME_SPACE}-input`"
				/>
			</el-form-item>
			<el-form-item :label="$t('course.stage')" prop="stage">
				<el-select v-model="ruleForm.stage">
					<el-option
						v-for="value in intervals.length + 1"
						:key="value"
						:label="getStageString(value - 1, intervals.length)"
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
						:data-test-unit="`${NAME_SPACE}-confirm`"
					>
						{{ $t('actions.confirm') }}
					</el-button>

					<DeleteButton
						:name="props.progress.name"
						@delete="emit('delete', progress._id)"
					/>
				</div>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>

<style scoped></style>
