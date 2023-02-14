<script setup lang="ts">
defineProps<{
	data?: any
	loading: boolean
	error: boolean
}>()
</script>

<template>
	<div>
		<div
			v-if="loading"
			v-loading="loading"
			h-80
			element-loading-text="Loading..."
			element-loading-background="rgba(122, 122, 122, 0)"
		></div>
		<div v-else-if="error">
			<el-result
				icon="error"
				title="Error"
				sub-title="Error when fetching data."
			>
			</el-result>
		</div>
		<slot v-else name="data" :data="data" />
	</div>
</template>
