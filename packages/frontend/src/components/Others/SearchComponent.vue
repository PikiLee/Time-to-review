<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { messages, type Course, type Progress } from 'shared'
import * as courseApi from '@/database/course'
import * as progressApi from '@/database/progress'
import { errorMsg } from '@/utils/useMessage'
import { throttle } from 'lodash-es'

const { t } = useI18n({
	messages: {
		en: {
			placeholder: 'Start Searching!'
		},
		'zh-Hans': {
			placeholder: '开始搜索吧!'
		}
	},
	sharedMessages: messages
})

type SearchResult = {
	course: Course
	progresses?: Progress[]
}

const input = ref('')
const searchResults = ref<SearchResult[]>([])

async function rawSearch() {
	try {
		searchResults.value = []
		if (input.value.length === 0) return
		const courseResults = await courseApi.search(input.value)
		courseResults.forEach((r) =>
			searchResults.value.push({
				course: r
			})
		)
		const progressResults = await progressApi.searchAll(input.value)
		for (const progress of progressResults) {
			const searchResult = searchResults.value.find(
				(result) => result.course._id === progress.course
			)
			if (searchResult) {
				if (searchResult.progresses)
					searchResult.progresses.push(progress)
				else searchResult.progresses = [progress]
			} else {
				const course = await courseApi.fetch(progress.course)
				searchResults.value.push({
					course,
					progresses: [progress]
				})
			}
		}
	} catch (err) {
		errorMsg('Something is wrong!')
	}
}

const search = throttle(rawSearch, 500)
</script>

<template>
	<div>
		<el-input
			v-model="input"
			clearable
			:placeholder="t('placeholder')"
			@input="search"
		>
			<template #prefix>
				<div i-mdi-search></div>
			</template>
		</el-input>
		<ul list-style-none>
			<li v-for="item in searchResults" :key="item.course._id">
				<h2>{{ item.course.name }}</h2>
				<ul v-if="item.progresses">
					<li v-for="progress in item.progresses" :key="progress._id">
						{{ progress.name }}
					</li>
				</ul>
			</li>
		</ul>
	</div>
</template>

<style scoped lang="scss"></style>
