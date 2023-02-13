<script setup lang="ts">
import BANNER1 from '@/assets/images/banner1.png'
import BANNER2 from '@/assets/images/banner2.png'
import { useUserStore } from '@/store/user.store'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { computed } from 'vue'

const fit = 'cover'

const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndLarger = breakpoints.greaterOrEqual('md')
const wrapperStyle = computed(() =>
	mdAndLarger.value ? { 'grid-template-rows': '70% 30%' } : {}
)

const userStore = useUserStore()
</script>

<template>
	<div grid md-grid-cols-12 py-16 class="gap-[2px]" :style="wrapperStyle">
		<div md-col-span-8 class="banner first">
			<el-image
				:style="{
					height: '100%',
					width: '100%'
				}"
				:src="BANNER1"
				:fit="fit"
			/>
		</div>
		<div md-col-span-4 p-8 grid place-items-center>
			<h1 text-center>
				Effortlessly Track Your Progress and Review at the Right Time
			</h1>
			<el-button type="primary" size="large" v-if="!userStore.isLogin"
				><RouterLink no-underline :to="{ name: 'register' }">
					SIGN UP NOW
				</RouterLink></el-button
			>
			<el-button type="primary" size="large" v-else
				><RouterLink no-underline :to="{ name: 'home' }">
					Start Review
				</RouterLink></el-button
			>
		</div>
		<div md-col-span-8 grid place-items-center>
			<h1 p-8 text-center>Never Forget What You've Learned</h1>
		</div>
		<div md-col-span-4 class="banner second">
			<el-image
				:style="{
					height: '100%',
					width: '100%'
				}"
				:src="BANNER2"
				:fit="fit"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
$gap: 2px;
.banner {
	position: relative;

	&::before {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;

		background-color: #84cc16;
	}

	&.first {
		&::before {
			top: $gap;
			left: $gap;
		}
	}

	&.second {
		&::before {
			bottom: $gap;
			right: $gap;
		}
	}
}
</style>
