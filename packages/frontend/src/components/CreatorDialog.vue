<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { create as createCourse } from '@/database/course'
import { create as createProgress } from '@/database/progress'
import { errorMsg, successMsg } from '@/utils/useMessage'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
	type: 'course' | 'progress'
}>()
const emit = defineEmits(['ok'])

const isCreatingCourse = computed(() => props.type === 'course')
const { t } = useI18n()
const input = ref('')
const defaultPlaceholder = computed(() => {
	return isCreatingCourse.value
		? t('addButton.course.create')
		: t('addButton.progress.create')
})
const placeholder = ref(defaultPlaceholder.value)
watch(
	defaultPlaceholder,
	(newPlaceholder) => (placeholder.value = newPlaceholder),
	{ immediate: true }
)

async function handleCreate() {
	try {
		if (!input.value) throw new Error(t('errors.required'))
		if (input.value.length > 60)
			throw new Error('At most 60 characters long.')
		if (!isCreatingCourse.value) {
			await createProgress(input.value)
		} else {
			await createCourse(input.value)
		}
		emit('ok')
		successMsg(
			isCreatingCourse.value
				? t('addButton.progress.success', [input.value])
				: t('addButton.course.success', [input.value])
		)
	} catch (err) {
		errorMsg(String(err))
	} finally {
		input.value = ''
	}
}

const buttonType = computed(() => (isCreatingCourse.value ? 'primary' : 'info'))
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
	>
		<el-input
			v-model="input"
			:placeholder="placeholder"
			@keyup.enter="handleCreate"
			data-testid="creator-dialog-input"
		/>
		<el-button
			:type="buttonType"
			round
			bg-lime-500
			@click="handleCreate"
			data-testid="creator-dialog-button"
			>{{ $t('actions.create') }}</el-button
		>
	</div>
</template>
