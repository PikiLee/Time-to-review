<script setup lang="ts"></script>

<template>
	<el-popover placement="bottom" trigger="hover">
		<ul>
			<li>
				<el-button text w-full @click="$i18n.locale = 'en'"
					>English</el-button
				>
			</li>
			<li>
				<el-button text w-full @click="$i18n.locale = 'zh-Hans'"
					>中文</el-button
				>
			</li>
		</ul>
		<template #reference>
			<div i-mdi-spoken-language text-xl></div>
		</template>
	</el-popover>
</template>

<style scoped lang="scss"></style>
