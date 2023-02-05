<script setup lang="ts">
import { useUserStore } from '@/store/user.store'
import { useCustomRouter } from '@/utils/useCustomRouter'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CourseCreator from './Course/CourseCreator.vue'

const userStore = useUserStore()
const dialogVisible = ref(false)
const breakpoints = useBreakpoints(breakpointsTailwind)
const largerThanMd = breakpoints.greater('md')
const { t } = useI18n()

const { isCoursePage } = useCustomRouter()
const toolTip = computed(() =>
	isCoursePage.value ? t('addButton.progress.create') : t('addButton.course.create')
)
const buttonType = computed(() => (isCoursePage.value ? 'info' : 'primary'))
</script>

<template>
	<el-tooltip
		effect="dark"
		:content="toolTip"
		placement="left"
		v-if="userStore.isLogin"
	>
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
		<CourseCreator @ok="dialogVisible = false" />
	</el-dialog>
</template>

<style lang=""></style>
