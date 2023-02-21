<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseDialog from '../Others/BaseDialog.vue'
import { useI18n } from 'vue-i18n'
import { messages } from 'shared'

const { t } = useI18n({
	messages: {
		en: {
			search: 'Search'
		},
		'zh-Hans': {
			search: '搜索'
		}
	},
	sharedMessages: messages
})
const router = useRouter()
// search dialog
const searchDialogVisible = ref(false)
function goToCourse(courseId: string) {
	searchDialogVisible.value = false
	router.push({ name: 'course', params: { id: courseId } })
}
</script>

<template>
	<BaseDialog v-model="searchDialogVisible" :title="t('search')">
		<SearchComponent @click="goToCourse" />
	</BaseDialog>

	<el-button text @click="searchDialogVisible = true">
		<div text-lg gap-1 font-600 flex flex-row items-center>
			<div i-mdi-search></div>
		</div>
	</el-button>
</template>

<style scoped lang="scss"></style>
