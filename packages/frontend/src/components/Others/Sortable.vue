<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Sortable } from '@shopify/draggable'

const props = defineProps<{
	group?: string
}>()
const emit = defineEmits(['end'])

const wrapper = ref<HTMLDivElement>()
const draggable = Math.random().toString().slice(2)

onMounted(() => {
	// Sortable.create(wrapper.value!, {
	// 	// group: props.group ?? Math.random().toString().slice(2),
	// 	draggable: '.item',
	// 	onStart: () => {
	// 		console.log('start')
	// 	},
	// 	onEnd: function (/**Event*/ evt) {
	// 		emit('end', evt)
	// 	}
	// })
	const sortable = new Sortable(document.querySelectorAll('ul'), {
		draggable: '.' + draggable
	})

	sortable.on('sortable:start', () => console.log('sortable:start'))
	sortable.on('sortable:sort', () => console.log('sortable:sort'))
	sortable.on('sortable:sorted', () => console.log('sortable:sorted'))
	sortable.on('sortable:stop', () => console.log('sortable:stop'))
})
</script>

<template>
	<div ref="wrapper">
		<slot :draggable="draggable" />
	</div>
</template>

<style scoped></style>
