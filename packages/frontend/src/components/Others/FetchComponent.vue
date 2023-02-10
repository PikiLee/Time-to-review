<script setup lang="ts">
import { useFetchData } from '@/composables/useFetchData'

const props = defineProps<{
	fetchFunc: Function
}>()

const { loading, error, data } = useFetchData(props.fetchFunc)
</script>

<template>
	<div>
		<div v-if="loading">Loading</div>
		<div v-else-if="error">Error</div>
		<slot v-else name="data" :data="data" />
	</div>
</template>

<style scoped></style>
