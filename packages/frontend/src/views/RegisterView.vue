<script setup lang="ts">
import type { FormRules } from "element-plus";
import { reactive } from "vue";
import { getPasswordValidationRegex } from "shared";

const form = reactive({
	username: "",
	password: "",
});

const rules = reactive<FormRules>({
	username: [
		{ required: true, message: "Please input username", trigger: "blur" },
		{ min: 2, max: 12, message: "Length should be 2 to 12", trigger: "change" },
	],
	password: [
		{ required: true, message: "Please input password", trigger: "blur" },
		{
			min: 12,
			max: 24,
			message: "Length ",
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
				<el-form-item label="Username" prop="username">
					<el-input v-model="form.username" />
				</el-form-item>
				<el-form-item label="Password" prop="password">
					<el-input type="password" v-model="form.password" />
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">Create</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
