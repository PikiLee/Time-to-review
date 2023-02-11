<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { errorMsg } from '@/utils/useMessage'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
	type: 'course' | 'progress'
}>()
const emit = defineEmits(['create:progress', 'create:course'])

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
	if (!input.value) errorMsg(t('errors.required'))
	if (input.value.length > 60) errorMsg('At most 60 characters long.')
	if (props.type === 'progress') {
		emit('create:progress', input.value)
	} else {
		emit('create:course', input.value)
	}

	input.value = ''
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
