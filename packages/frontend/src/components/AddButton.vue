<script setup lang="ts">
import type { ButtonType } from 'element-plus'

defineProps<{
	type: ButtonType
	toolTip: string
}>()
defineEmits(['click'])
</script>

<template>
	<el-tooltip effect="dark" :content="toolTip" placement="left">
		<el-button
			:type="type"
			circle
			fixed
			right-10
			bottom-10
			size="large"
			@click="$emit('click')"
			data-testid="add-button"
		>
			<template #icon>
				<div i-mdi-add></div>
			</template>
		</el-button>
	</el-tooltip>

	<!-- <el-dialog
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
	</el-dialog> -->
</template>

<style lang=""></style>
