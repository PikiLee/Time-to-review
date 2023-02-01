<script setup lang="ts">
import type { FormRules } from "element-plus";
import { reactive } from "vue";
import { AUTH_URL, getPasswordValidationRegex } from "shared";
import { api } from "@/database/api";

const form = reactive({
	username: "",
	password: "",
});

const rules = reactive<FormRules>({
	username: [
		{ required: true, message: "Please input username", trigger: "blur" },
		{ min: 2, max: 12, message: "Length should be 2 to 12", trigger: "change" },
		{
			asyncValidator(_, username) {
				return new Promise((resolve, reject) => {
					api
						.get(`${AUTH_URL}/${username}`)
						.then(() => {
							resolve();
						})
						.catch(() => {
							reject("The username has existed.");
						});
				});
			},
			trigger: "blur",
		},
	],
	password: [
		{ required: true, message: "Please input password", trigger: "blur" },
		{
			min: 12,
			max: 24,
			message: "Length should be 12 to 24",
			trigger: "change",
		},
		{
			validator(_, password) {
				const { regex, errorMsg } = getPasswordValidationRegex();
				if (!regex.test(password)) {
					return [new Error(errorMsg)];
				}
			},
			trigger: "change",
		},
	],
});

function onSubmit() {}
</script>

<template>
	<div grid place-items-center class="min-h-[50vh]">
		<div border border-color-warmgray-500 p-10 pt-18 rounded w-100 max-w-full>
			<el-form :model="form" :rules="rules" label-width="80px">
				<el-form-item
					label="Username"
					prop="username"
					data-testid="register-form-username"
				>
					<el-input v-model="form.username" />
				</el-form-item>
				<el-form-item
					label="Password"
					prop="password"
					data-testid="register-form-password"
				>
					<el-input type="password" v-model="form.password" />
				</el-form-item>
				<el-form-item mt-10>
					<el-button
						type="primary"
						@click="onSubmit"
						data-testid="register-form-submit"
						>Create</el-button
					>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
