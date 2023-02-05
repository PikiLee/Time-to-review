<script setup lang="ts">
import { useUserStore } from '@/store/user.store'
import { useCustomRouter } from '@/utils/useCustomRouter'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { computed, ref } from 'vue'
import CourseCreator from './Course/CourseCreator.vue'

const userStore = useUserStore()
const dialogVisible = ref(false)
const breakpoints = useBreakpoints(breakpointsTailwind)
const largerThanMd = breakpoints.greater('md')

const { isCoursePage } = useCustomRouter()
const toolTip = computed(() =>
	isCoursePage.value ? 'Create Progress' : 'Create Course'
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
		title="Create"
		:width="largerThanMd ? '40%' : '90%'"
	>
		<CourseCreator @ok="dialogVisible = false" />
	</el-dialog>
</template>

<style lang=""></style>
