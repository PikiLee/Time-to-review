<script setup lang="ts">
import Sortable from 'sortablejs'
import { computed, onMounted, ref } from 'vue'
import { messages } from 'shared'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
	items: any[]
	itemKey: string
	title?: string
	group?: string
	sortable?: boolean
	badge?: string | number
	badgeType?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}>()

const emit = defineEmits(['dragend'])

const { t } = useI18n({
	messages: {
		en: {
			empty: 'There is nothing here.'
		},
		'zh-Hans': {
			empty: '这里什么也没有。'
		}
	},
	sharedMessages: messages
})

// is empty
const isEmpty = computed(() => props.items.length === 0)

// list style
const listStyle = ref<'grid' | 'list'>('grid')
const listClasses = computed(() =>
	listStyle.value === 'grid'
		? 'grid grid-cols-1 sm-grid-cols-2 md-grid-cols-3 gap-4 items-stretch'
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
			delay: 300,
			delayOnTouchOnly: true,
			draggable: '.' + draggableClass,
			onEnd: function (/**Event*/ evt) {
				emit('dragend', evt)
			}
		})
	}
})
</script>

<template>
	<div p-2 data-testid="items">
		<div text-3xl flex items-center mb-2>
			<div text-2xl flex-grow-1 items-center>
				<el-badge
					v-if="title"
					:value="badge"
					:type="badgeType ?? 'primary'"
					data-testid="items-badge"
				>
					<h3 m-0>{{ title }}</h3>
				</el-badge>
				<slot v-else name="header" />
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
			m-none
			p-0
			:class="listClasses"
			v-show="!hidden && !isEmpty"
			ref="wrapper"
		>
			<li
				v-for="item in items"
				:key="item[itemKey]"
				:class="draggableClass"
			>
				<slot name="item" :item="item" />
			</li>
		</ul>
		<el-empty v-if="!hidden && isEmpty" :description="t('empty')" />
	</div>
</template>

<style scoped></style>
