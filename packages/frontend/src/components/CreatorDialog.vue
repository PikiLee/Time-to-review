<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { errorMsg } from '@/utils/useMessage'
import { useI18n } from 'vue-i18n'
import type { Course, CourseWithProgress } from 'shared'

const props = defineProps<{
	resource:
		| {
				type: 'progress'
				course: CourseWithProgress
		  }
		| {
				type: 'course'
				courses: Course[]
		  }
}>()
const emit = defineEmits(['ok'])

const isCreatingCourse = computed(() => props.resource.type === 'course')
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
	if (props.resource.type === 'progress') {
		// await create(
		// 	{
		// 		type: 'progress',
		// 		name: input.value,
		// 		course: props.resource.course._id
		// 	},
		// 	props.resource.course.progresses
		// )
	} else {
		// await create(
		// 	{
		// 		type: 'course',
		// 		name: input.value
		// 	},
		// 	props.resource.courses
		// )
	}
	emit('ok')

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
