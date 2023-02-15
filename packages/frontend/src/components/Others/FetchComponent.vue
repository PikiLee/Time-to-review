<script setup lang="ts">
import { messages } from 'shared'
import { useI18n } from 'vue-i18n'

defineProps<{
	data?: any
	loading: boolean
	error: boolean
}>()

const { t } = useI18n({
	messages: {
		en: {
			title: 'Error',
			subTitle: 'Error when fetching data.',
			loading: 'Loading...'
		},
		'zh-Hans': {
			title: '错误',
			subTitle: '获取数据时发生错误。',
			loading: '加载中...'
		}
	},
	sharedMessages: messages
})
</script>

<template>
	<div>
		<div
			v-if="loading"
			v-loading="loading"
			h-80
			:element-loading-text="t('loading')"
			element-loading-background="rgba(122, 122, 122, 0)"
		></div>
		<div v-else-if="error">
			<el-result
				icon="error"
				:title="t('title')"
				:sub-title="t('subTitle')"
			>
			</el-result>
		</div>
		<slot v-else name="data" :data="data" />
	</div>
</template>
