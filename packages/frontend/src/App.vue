<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppHeader from './components/AppHeader/AppHeader.vue'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import IntroView from './views/IntroView.vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import { useI18n } from 'vue-i18n'

const route = useRoute()

const isIntroPage = computed(() => route.name === 'intro')

// update height

const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndLarger = breakpoints.greaterOrEqual('md') // sm and larger
const footerEl = ref()
const contentHeight = ref(200)

const contentStyle = computed(() => {
	if (mdAndLarger.value) {
		return { height: contentHeight.value + 'px' }
	} else {
		return {}
	}
})

function updateHeight(h: number) {
	contentHeight.value =
		document.documentElement.clientHeight - h - footerEl.value.clientHeight
}

// local
const i18n = useI18n()
const locale = computed(() => (i18n.locale.value === 'zh-Hans' ? zhCn : en))
</script>

<template>
	<el-config-provider :locale="locale">
		<div
			bg-warmgray-100
			min-w-full
			min-h-screen
			h-max
			text-xs
			prose
			dark:prose-invert
			prose-warmgray
			dark:bg-warmgray-800
		>
			<AppHeader @update-height="updateHeight" />
			<div w-4xl max-w-screen mx-auto px-2 gap-4 v-if="!isIntroPage">
				<RouterView />
			</div>
			<div v-else>
				<IntroView :style="contentStyle" />
			</div>
			<div h-10vh ref="footerEl"></div>
		</div>
	</el-config-provider>
</template>
