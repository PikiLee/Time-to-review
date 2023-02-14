<script setup lang="ts">
import { createUnitTestIdGetter } from '@/unit/utils'
import type { FormInstance, FormRules } from 'element-plus'
import type { Course } from 'shared'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
	course: Course
}>()
const emit = defineEmits(['update', 'cancel'])

const NAME_SPACE = 'course-setting'
const getUnitTestId = createUnitTestIdGetter(NAME_SPACE)
const { t } = useI18n()

//form
const ruleFormRef = ref<FormInstance>()

function getPropertyName(index: number) {
	return `${t('components.course.courseSetting.interval')} ${index + 1}`
}

const rules = reactive<FormRules>({
	name: [
		{
			required: true,
			message: t('components.course.courseSetting.required', [
				t('components.course.courseSetting.name')
			]),
			trigger: 'blur'
		},
		{
			type: 'string',
			min: 1,
			max: 60,
			message: 'Length should be 1 to 60',
			trigger: 'blur'
		}
	],
	intervals: [
		{
			required: true,
			message: t('components.course.courseSetting.required', [
				t('components.course.courseSetting.name')
			]),
			trigger: 'blur'
		},
		{
			type: 'array',
			validator(_, value: number[]) {
				return value.length >= 1 && value.every((v) => v >= 1)
			},
			message: 'All intervals should larger than 0.'
		}
	]
})

const ruleForm = reactive({
	name: props.course.name,
	intervals: props.course.intervals
})

const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return
	await formEl.validate((valid) => {
		if (valid) {
			emit('update', ruleForm)
		}
	})
}

function addInterval() {
	ruleForm.intervals.push(1)
}

function removeInterval() {
	ruleForm.intervals.splice(-1, 1)
}
</script>

<template>
	<el-form
		ref="ruleFormRef"
		:model="ruleForm"
		:rules="rules"
		label-width="120px"
		class="demo-ruleForm"
		status-icon
		:data-test-unit="getUnitTestId('wrapper')"
	>
		<el-form-item
			:label="$t('components.course.courseSetting.name')"
			prop="name"
		>
			<el-input v-model="ruleForm.name" />
		</el-form-item>
		<div flex gap-6 my-6 items-center justify-between>
			<h3 m-none>
				{{ $t('components.course.courseSetting.interval', 2) }}
			</h3>
			<div>
				<el-tooltip
					effect="dark"
					:content="$t('components.course.courseSetting.add')"
					placement="top"
				>
					<el-button
						@click="addInterval"
						:data-test-unit="getUnitTestId('add-interval')"
						><div i-mdi-add></div
					></el-button>
				</el-tooltip>
				<el-tooltip
					effect="dark"
					:content="$t('components.course.courseSetting.remove')"
					placement="top"
				>
					<el-button
						@click="removeInterval"
						:data-test-unit="getUnitTestId('remove-interval')"
						><div i-mdi-minus></div
					></el-button>
				</el-tooltip>
			</div>
		</div>
		<el-form-item
			:label="getPropertyName(index)"
			prop="intervals"
			v-for="(interval, index) in ruleForm.intervals"
			:key="index"
			:data-test-unit="getUnitTestId('interval-input')"
		>
			<el-input-number v-model="ruleForm.intervals[index]" :min="1" />
		</el-form-item>
		<el-form-item>
			<slot name="actions"></slot>
			<el-button
				@click="$emit('cancel')"
				:data-test-unit="getUnitTestId('cancel')"
				>{{ $t('actions.cancel') }}</el-button
			>
			<el-button
				type="primary"
				@click="() => submitForm(ruleFormRef)"
				:data-test-unit="getUnitTestId('confirm')"
			>
				{{ $t('actions.confirm') }}
			</el-button>
		</el-form-item>
	</el-form>
</template>

<style scoped></style>
