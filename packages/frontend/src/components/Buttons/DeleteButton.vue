<script setup lang="ts">
import { createUnitTestIdGetter } from '@/unit/utils'
import { ref } from 'vue'

defineProps<{
	name: string
}>()
const emit = defineEmits(['delete'])
const NAME_SPACE = 'delete-button'
const getUnitTestId = createUnitTestIdGetter(NAME_SPACE)

const dialogVisible = ref(false)

function handleDelete() {
	dialogVisible.value = false
	emit('delete')
}
</script>

<template>
	<el-button
		type="info"
		@click="dialogVisible = true"
		data-testid="delete-button"
		:data-test-unit="getUnitTestId('button')"
	>
		{{ $t('actions.delete') }}
	</el-button>

	<el-dialog
		v-model="dialogVisible"
		title="Are you sure?"
		width="90%"
		max-w-screen-sm
		append-to-body
		:data-test-unit="getUnitTestId('dialog')"
	>
		<span>{{ `Are you sure to delete ${name}?` }}</span>
		<template #footer>
			<span class="dialog-footer">
				<el-button
					@click="dialogVisible = false"
					:data-test-unit="getUnitTestId('cancel')"
					>Cancel</el-button
				>
				<el-button
					type="primary"
					@click="handleDelete"
					data-testid="delete-button-confirm"
					:data-test-unit="getUnitTestId('confirm')"
				>
					Confirm
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<style scoped></style>
