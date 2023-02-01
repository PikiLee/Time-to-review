<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import { computed, reactive, ref } from "vue";
import { AUTH_URL, getPasswordValidationRegex } from "shared";
import { api } from "@/database/api";
import { useRouter } from "vue-router";
import { errorMsg } from "@/utils/useMessage";
import { useI18n } from "vue-i18n";

const router = useRouter();
const { t } = useI18n();

const ruleFormRef = ref<FormInstance>();
const form = reactive({
	username: "",
	password: "",
});

const rules = computed<FormRules>(() => ({
	username: [
		{
			required: true,
			message: t("auth.errors.required", [t("auth.username")]),
			trigger: "blur",
		},
		{
			min: 2,
			max: 12,
			message: t("auth.errors.length", [2, 12]),
			trigger: "change",
		},
		{
			asyncValidator(_, username) {
				return new Promise((resolve, reject) => {
					api
						.get(`${AUTH_URL}/${username}`)
						.then(() => {
							resolve();
						})
						.catch(() => {
							reject(t("auth.errors.existUsername"));
						});
				});
			},
			trigger: "blur",
		},
	],
	password: [
		{
			required: true,
			message: t("auth.errors.required", [t("auth.password")]),
			trigger: "blur",
		},
		{
			min: 12,
			max: 24,
			message: t("auth.errors.length", [12, 24]),
			trigger: "change",
		},
		{
			validator(_, password) {
				const { regex } = getPasswordValidationRegex();
				if (!regex.test(password)) {
					return [new Error(t("auth.errors.invalidPassword", [12, 24]))];
				} else {
					return true;
				}
			},
			trigger: "change",
		},
	],
}));

async function onSubmit(formEl: FormInstance) {
	if (!formEl) return;
	await formEl.validate((valid) => {
		if (valid) {
			api
				.post(`${AUTH_URL}/register`, {
					data: form,
				})
				.then(() => {
					router.push({ name: "home" });
				})
				.catch(() => errorMsg("Register Failed."));
		} else {
			errorMsg("Invalid username or password.");
		}
	});
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
					<el-button
						type="primary"
						@click="onSubmit(ruleFormRef)"
						data-testid="register-form-submit"
						>{{ $t("auth.register") }}</el-button
					>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
