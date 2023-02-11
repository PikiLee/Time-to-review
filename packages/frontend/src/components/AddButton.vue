<script setup lang="ts">
import { useRouter } from 'vue-router'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CreatorDialog from '@/components/CreatorDialog.vue'
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

const router = useRouter()
const dialogVisible = ref(false)
const breakpoints = useBreakpoints(breakpointsTailwind)
const largerThanMd = breakpoints.greater('md')
const { t } = useI18n()

const isCreatingCourse = computed(() => props.resource.type === 'course')
const toolTip = computed(() =>
	isCreatingCourse.value
		? t('addButton.course.create')
		: t('addButton.progress.create')
)
const buttonType = computed(() => (isCreatingCourse.value ? 'primary' : 'info'))

function handleOk() {
	dialogVisible.value = false
	if (isCreatingCourse.value) {
		router.push({ name: 'courses' })
	}
}
</script>

<template>
	<el-tooltip effect="dark" :content="toolTip" placement="left">
		<el-button
			:type="buttonType"
			circle
			fixed
			right-10
			bottom-10
			size="large"
			@click="dialogVisible = true"
			data-testid="add-button"
		>
			<template #icon>
				<div i-mdi-add></div>
			</template>
		</el-button>
	</el-tooltip>

	<el-dialog
		v-model="dialogVisible"
		:title="toolTip"
		:width="largerThanMd ? '40%' : '90%'"
	>
		<CreatorDialog :resource="resource" @ok="handleOk" />
	</el-dialog>
</template>

<style lang=""></style>
