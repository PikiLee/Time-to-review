<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints, useVModel } from '@vueuse/core'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CreatorDialog from '@/components/CreatorDialog.vue'

const props = defineProps<{
	visible?: boolean
	type: 'course' | 'progress'
}>()
const emit = defineEmits(['create:progress', 'create:course', 'update:visible'])

const dialogVisible = useVModel(props, 'visible', emit)
const breakpoints = useBreakpoints(breakpointsTailwind)
const largerThanMd = breakpoints.greater('md')
const { t } = useI18n()

const isCreatingCourse = computed(() => props.type === 'course')
const toolTip = computed(() =>
	isCreatingCourse.value
		? t('addButton.course.create')
		: t('addButton.progress.create')
)
const buttonType = computed(() => (isCreatingCourse.value ? 'primary' : 'info'))
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
		<CreatorDialog
			:type="type"
			@create:course="
				(v) => {
					emit('create:course', v)
					dialogVisible = false
				}
			"
			@create:progress="
				(v) => {
					emit('create:progress', v)
					dialogVisible = false
				}
			"
		/>
	</el-dialog>
</template>

<style lang=""></style>
