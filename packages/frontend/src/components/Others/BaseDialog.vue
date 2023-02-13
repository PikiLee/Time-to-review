<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = defineProps<{
	modelValue: boolean
	title: string
}>()

const emit = defineEmits(['update:modelValue'])
const visible = useVModel(props, 'modelValue', emit)
</script>

<template>
	<el-dialog v-model="visible" :title="title" max-w-screen-sm width="90%">
		<slot />
		<template #footer>
			<slot name="footer" />
		</template>
	</el-dialog>
</template>

<style scoped></style>
