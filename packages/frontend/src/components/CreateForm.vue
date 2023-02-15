<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ButtonType } from 'element-plus'
import { createUnitTestIdGetter } from '@/unit/utils'

const props = withDefaults(
	defineProps<{
		label: string
		buttonType?: ButtonType
		max?: number
		min?: number
	}>(),
	{
		buttonType: 'primary',
		max: 60,
		min: 1
	}
)
const emit = defineEmits(['update:visible', 'ok'])

const NAME_SPACE = 'create-form'
const getUnitTestId = createUnitTestIdGetter(NAME_SPACE)

const { t } = useI18n()

const input = ref('')
const error = ref('')

async function handleCreate() {
	if (input.value.length < props.min) {
		error.value = t('errors.length', [props.min, props.max])
		return
	}
	if (input.value.length > 60) {
		error.value = t('errors.length', [props.min, props.max])
		return
	}

	emit('ok', input.value)
}
</script>

<template>
	<div
		py-10
		grid
		grid-cols-1
		gap-2
		auto-rows-min
		justify-items-center
		data-testid="creator-dialog"
		:data-test-unit="getUnitTestId('wrapper')"
	>
		<el-input
			v-model="input"
			minlength="min"
			maxlength="max"
			autofocus
			:placeholder="$t('actions.placeholder')"
			@keyup.enter="handleCreate"
			@change="error = ''"
			id="create-form-input"
			data-testid="creator-dialog-input"
			><template #prepend
				><label for="create-form-input" text-slate-400>{{
					label
				}}</label></template
			>
		</el-input>
		<div v-if="error" text-red-400 :data-test-unit="getUnitTestId('error')">
			{{ error }}
		</div>
		<el-button
			:type="buttonType"
			round
			bg-lime-500
			mt-8
			@click="handleCreate"
			data-testid="creator-dialog-button"
			>{{ $t('actions.create') }}</el-button
		>
	</div>
</template>
