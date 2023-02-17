<script setup lang="ts">
import { useUserStore } from '@/store/user.store'
import { useDark, useElementBounding, useToggle } from '@vueuse/core'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as authApi from '@/database/auth'
import { useI18n } from 'vue-i18n'
import { messages } from 'shared'

const emit = defineEmits(['updateHeight'])

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

const isDark = useDark()
const toggleDark = useToggle(isDark)
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const isIntroPage = computed(() => route.name === 'intro')

function logout() {
	authApi.logout().finally(() => {
		userStore.user = null
		localStorage.removeItem('user')
		router.push({ name: 'login' })
	})
}

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
	<div flex py-4 gap-8 ref="wrapperEl">
		<div flex-grow-1></div>

		<!-- Web site icon -->
		<RouterLink
			flex
			justify-start
			items-center
			flex-row
			gap-3
			link-decoration-none
			:to="{ name: 'intro' }"
		>
			<div>
				<img
					src="../assets/icon.png"
					alt="website icon"
					border-rounded-full
					w-10
				/>
			</div>
			<h1 text-5 display-none md:block>Time To Review</h1>
		</RouterLink>

		<!-- Home Course Link -->
		<div flex-grow-3 flex flex-row gap-4 items-center justify-end>
			<el-button text>
				<div text-lg gap-1 font-600 flex flex-row items-center>
					<div i-mdi-search></div>
					<div>{{ t('search') }}</div>
				</div>
			</el-button>
			<RouterLink
				v-if="!isIntroPage || userStore.isLogin"
				font-600
				text-lg
				link-decoration-none
				hover:text-lime-500
				:to="{ name: 'home' }"
				data-testid="app-header-home"
				>{{ $t('header.home') }}</RouterLink
			>
			<RouterLink
				v-if="!isIntroPage || userStore.isLogin"
				font-600
				text-lg
				link-decoration-none
				hover:text-lime-500
				:to="{ name: 'courses' }"
				data-testid="app-header-courses"
				>{{ $t('header.course') }}</RouterLink
			>
			<div flex flex-row items-center gap-4 justify-start self-center>
				<div @click="toggleDark()" cursor-pointer mb="0.125rem">
					<span
						text-xl
						text-warmgray-100
						i-material-symbols-dark-mode
						v-if="isDark"
					/>
					<span
						text-xl
						text-warmgray-700
						i-material-symbols-light-mode
						v-else
					/>
				</div>
				<el-popover placement="bottom" trigger="hover">
					<ul>
						<li>
							<el-button text w-full @click="$i18n.locale = 'en'"
								>English</el-button
							>
						</li>
						<li>
							<el-button
								text
								w-full
								@click="$i18n.locale = 'zh-Hans'"
								>中文</el-button
							>
						</li>
					</ul>
					<template #reference>
						<div i-mdi-spoken-language text-xl></div>
					</template>
				</el-popover>
				<el-popover
					placement="bottom"
					trigger="hover"
					v-if="userStore.user"
				>
					<div>
						<el-button
							text
							w-full
							data-testid="app-header-logout"
							@click="logout"
							>{{ $t('auth.logout') }}</el-button
						>
					</div>
					<template #reference>
						<div data-testid="app-header-username">
							{{ userStore.user.username }}
						</div>
					</template>
				</el-popover>
				<div v-else text-xl flex gap-2>
					<RouterLink
						font-600
						text-lg
						link-decoration-none
						hover:text-lime-500
						:to="{ name: 'register' }"
						>{{ $t('auth.register') }}</RouterLink
					>
					<RouterLink
						font-600
						text-lg
						link-decoration-none
						hover:text-lime-500
						:to="{ name: 'login' }"
						>{{ $t('auth.login') }}</RouterLink
					>
				</div>
			</div>
		</div>
		<div flex-grow-1></div>
	</div>
</template>
