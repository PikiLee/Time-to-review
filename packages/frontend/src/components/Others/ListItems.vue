<script setup lang="ts">
import Sortable from 'sortablejs'
import { computed, onMounted, ref } from 'vue'

const props = defineProps<{
	items: any[]
	itemKey: string
	title?: string
	group?: string
	sortable?: boolean
}>()

const emit = defineEmits(['dragend'])

// is empty
const isEmpty = computed(() => props.items.length === 0)

// list style
const listStyle = ref<'grid' | 'list'>('grid')
const listClasses = computed(() =>
	listStyle.value === 'grid'
		? 'grid grid-cols-1 sm-grid-cols-3 gap-4 items-stretch'
		: 'grid grid-cols-1 gap-4'
)

const hidden = ref(false)

// sortable
const wrapper = ref<HTMLDivElement>()
const draggableClass = 'draggable' + Math.random().toString().slice(2, 8)

onMounted(() => {
	if (props.sortable) {
		Sortable.create(wrapper.value!, {
			group: props.group ?? Math.random().toString().slice(2, 8),
			draggable: '.' + draggableClass,
			onEnd: function (/**Event*/ evt) {
				emit('dragend', evt)
			}
		})
	}
})
</script>

<template>
	<div p-2 m-4>
		<div text-3xl flex items-center>
			<div text-2xl flex-grow-1 items-center>
				<h3 v-if="title" m-0>{{ title }}</h3>
				<slot v-else name="title" />
			</div>
			<div flex items-center text-3xl>
				<slot name="actions" />
				<button
					i-clarity-eye-hide-line
					@click="hidden = !hidden"
				></button>
				<button
					i-material-symbols-format-list-bulleted-rounded
					@click="listStyle = 'list'"
				></button>
				<button
					i-material-symbols-grid-view-outline-rounded
					@click="listStyle = 'grid'"
				></button>
			</div>
		</div>
		<ul
			list-none
			:class="listClasses"
			v-show="!hidden && !isEmpty"
			ref="wrapper"
		>
			<li
				v-for="item in items"
				:key="item[itemKey]"
				:class="draggableClass"
			>
				<slot name="item" v-bind="item" />
			</li>
		</ul>
		<el-empty
			v-if="!hidden && isEmpty"
			description="There is nothing here."
		/>
	</div>
</template>

<style scoped></style>
