<script setup lang="ts">
import { useUserStore } from '@/store/user.store'
import { useElementBounding } from '@vueuse/core'
import { onMounted, ref, watch } from 'vue'
import AppHeaderMenu from './AppHeaderMenu.vue'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)

const smAndLarger = breakpoints.greaterOrEqual('sm')

const emit = defineEmits(['updateHeight'])

const userStore = useUserStore()

// calc height
const wrapperEl = ref()
const { height } = useElementBounding(wrapperEl)

onMounted(() => {
	watch(
		height,
		() => {
			emit('updateHeight', height.value)
		},
		{ immediate: true }
	)
})
</script>

<template>
	<div flex items-center py-4 gap-8 ref="wrapperEl">
		<div flex-grow-1 flex-shrink-1></div>

		<AppTitle />

		<SearchButton v-if="userStore.isLogin" />

		<AppHeaderMenu
			v-if="smAndLarger"
			:isLogin="userStore.isLogin"
			flexDirection="row"
		/>
		<el-popover v-else placement="bottom" :width="200" trigger="click">
			<template #reference>
				<button aria-label="menu">
					<div i-mdi-menu text-2xl></div>
				</button>
			</template>
			<AppHeaderMenu
				:isLogin="userStore.isLogin"
				flexDirection="column"
			/>
		</el-popover>
		<div flex-grow-1></div>
	</div>
</template>
