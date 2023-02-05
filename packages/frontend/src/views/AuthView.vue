<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { computed, reactive, ref } from 'vue'
import { AUTH_URL, getPasswordValidationRegex } from 'shared'
import { api } from '@/database/api'
import { useRoute, useRouter } from 'vue-router'
import { errorMsg, successMsg } from '@/utils/useMessage'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store/user.store'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const userStore = useUserStore()

const isRegister = computed(() => route.name === 'register')

const ruleFormRef = ref<FormInstance>()
const form = reactive({
	username: '',
	password: '',
})

const rules = computed<FormRules>(() => {
	return isRegister.value
		? {
			username: [
				{
					required: true,
					message: t('auth.errors.required', [t('auth.username')]),
					trigger: 'blur',
				},
				{
					min: 2,
					max: 12,
					message: t('auth.errors.length', [2, 12]),
					trigger: 'change',
				},
				{
					asyncValidator(_, username) {
						return new Promise((resolve, reject) => {
							api
								.get(`${AUTH_URL}/${username}`)
								.then(() => {
									resolve()
								})
								.catch((error) => {
									reject(error)
								})
						})
					},
					trigger: 'blur',
				},
			],
			password: [
				{
					required: true,
					message: t('auth.errors.required', [t('auth.password')]),
					trigger: 'blur',
				},
				{
					min: 12,
					max: 24,
					message: t('auth.errors.length', [12, 24]),
					trigger: 'change',
				},
				{
					validator(_, password) {
						const { regex } = getPasswordValidationRegex()
						if (!regex.test(password)) {
							return [new Error(t('auth.errors.invalidPassword', [12, 24]))]
						} else {
							return true
						}
					},
					trigger: 'change',
				},
			],
		}
		: {
			username: [
				{
					required: true,
					message: t('auth.errors.required', [t('auth.username')]),
					trigger: 'blur',
				},
			],
			password: [
				{
					required: true,
					message: t('auth.errors.required', [t('auth.password')]),
					trigger: 'blur',
				},
			],
		}
})

async function onSubmit(formEl: FormInstance | undefined) {
	if (!formEl) return
	await formEl.validate((valid) => {
		if (valid) {
			if (isRegister.value) {
				api
					.post(`${AUTH_URL}/register`, {
						data: form,
					})
					.then((res) => {
						userStore.user = res.data
						successMsg(t('auth.success', [t('auth.register')]))
						router.push({ name: 'home' })
					})
					.catch(() => errorMsg(t('auth.errors.fail', [t('auth.register')])))
			} else {
				api
					.post(`${AUTH_URL}/login`, {
						data: form,
					})
					.then((res) => {
						userStore.user = res.data
						successMsg(t('auth.success', [t('auth.login')]))
						router.push({ name: 'home' })
					})
					.catch(() => errorMsg(t('auth.errors.fail', [t('auth.login')])))
			}
		}
	})
}
</script>

<template>
	<div grid place-items-center class="min-h-[50vh]">
		<div border border-color-warmgray-500 p-10 pt-18 rounded w-100 max-w-full>
			<el-form
				:model="form"
				:rules="rules"
				ref="ruleFormRef"
				label-width="80px"
			>
				<el-form-item
					:label="$t('auth.username')"
					prop="username"
					data-testid="register-form-username"
				>
					<el-input v-model="form.username" />
				</el-form-item>
				<el-form-item
					:label="$t('auth.password')"
					prop="password"
					data-testid="register-form-password"
				>
					<el-input type="password" v-model="form.password" />
				</el-form-item>
				<el-form-item mt-10>
					<div flex gap-10>
						<el-button
							type="primary"
							@click="onSubmit(ruleFormRef)"
							data-testid="register-form-submit"
							>{{
								isRegister ? $t("auth.register") : $t("auth.login")
							}}</el-button
						>
						<RouterLink
							text-sm
							link-decoration-none
							hover:text-lime-500
							grid
							place-items-center
							:to="{ name: isRegister ? 'login' : 'register' }"
							>{{
								isRegister ? $t("auth.toLogin") : $t("auth.toRegister")
							}}</RouterLink
						>
					</div>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
