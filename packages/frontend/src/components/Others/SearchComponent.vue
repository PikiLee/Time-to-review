<script setup lang="ts">
import { onUpdated, ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { messages, type Course, type Progress } from 'shared'
import * as courseApi from '@/database/course'
import * as progressApi from '@/database/progress'
import { throttle } from 'lodash-es'
import FetchComponent from './FetchComponent.vue'
import { useFetchData } from '@/composables/useFetchData'
import Mark from 'mark.js'
import { useEventListener } from '@vueuse/core'

const emit = defineEmits(['click'])

const { t } = useI18n({
	messages: {
		en: {
			placeholder: 'Start Searching!',
			description: 'Nothing founded.'
		},
		'zh-Hans': {
			placeholder: '开始搜索吧!',
			description: '什么都没找到。'
		}
	},
	sharedMessages: messages
})

type SearchResult = {
	course: Course
	progresses?: Progress[]
}

const input = ref('')

async function rawSearch() {
	if (input.value.length === 0) return []
	const searchResults: SearchResult[] = []
	const courseResults = await courseApi.search(input.value)
	courseResults.forEach((r) =>
		searchResults.push({
			course: r
		})
	)
	const progressResults = await progressApi.searchAll(input.value)
	for (const progress of progressResults) {
		const searchResult = searchResults.find(
			(result) => result.course._id === progress.course
		)
		if (searchResult) {
			if (searchResult.progresses) searchResult.progresses.push(progress)
			else searchResult.progresses = [progress]
		} else {
			const course = await courseApi.fetch(progress.course)
			searchResults.push({
				course,
				progresses: [progress]
			})
		}
	}

	return searchResults
}
const {
	loading,
	error,
	data: searchResults,
	rerun
} = useFetchData<SearchResult[]>(rawSearch)
const search = throttle(rerun, 500)

// hightlight
const resultElList = ref<HTMLElement[]>()

onUpdated(() => {
	if (resultElList.value) {
		const instance = new Mark(resultElList.value)
		instance.mark(input.value)
	}
})

// use arrow key to choose result
const selectedResultIndex = ref(-1)
const wrapperEl = ref<HTMLDivElement>()
watchEffect(() => (selectedResultIndex.value = searchResults.value ? 0 : -1))
function move(direction: 'up' | 'down') {
	if (selectedResultIndex.value >= 0 && searchResults.value) {
		if (direction === 'down')
			selectedResultIndex.value = Math.min(
				searchResults.value.length - 1,
				selectedResultIndex.value + 1
			)
		else
			selectedResultIndex.value = Math.max(
				0,
				selectedResultIndex.value - 1
			)
	}
}

useEventListener(document, 'keydown', (e: KeyboardEvent) => {
	if (selectedResultIndex.value >= 0 && searchResults.value) {
		if (e.key === 'ArrowDown') {
			e.preventDefault()
			move('down')
		} else if (e.key === 'ArrowUp') {
			e.preventDefault()
			move('up')
		} else if (e.key === 'Enter') {
			e.preventDefault()
			emit(
				'click',
				searchResults.value[selectedResultIndex.value].course._id
			)
		}
	}
})
</script>

<template>
	<div ref="wrapperEl">
		<el-input
			v-model="input"
			clearable
			:placeholder="t('placeholder')"
			@input="search"
			autofocus
			@keydown.enter.prevent
			@keydown.arrow-up.prevent
			@keydown.arrow-down.prevent
		>
			<template #prefix>
				<div i-mdi-search></div>
			</template>
		</el-input>
		<FetchComponent :error="error" :loading="loading">
			<template #data>
				<ul
					v-if="searchResults && searchResults.length > 0"
					list-none
					p-0
					grid
					gap-4
					m-0
					mt-4
				>
					<li
						v-for="(item, index) in searchResults"
						:key="item.course._id"
						ref="resultElList"
						cursor-pointer
					>
						<el-card
							@click="emit('click', item.course._id)"
							:body-style="
								index === selectedResultIndex
									? {
											background: '#86efac'
									  }
									: {}
							"
						>
							<h2 m-none>{{ item.course.name }}</h2>
							<ul
								v-if="item.progresses"
								list-none
								p-0
								flex
								gap-1
								flex-row
								m-0
								mt-2
							>
								<li
									v-for="progress in item.progresses"
									:key="progress._id"
								>
									<el-tag type="info" effect="plain">
										{{ progress.name }}
									</el-tag>
								</li>
							</ul>
						</el-card>
					</li>
				</ul>
				<el-empty v-else :description="t('description')" />
			</template>
		</FetchComponent>
	</div>
</template>

<style scoped lang="scss"></style>
