<script setup lang="ts"></script>

<template>
	<!-- Web site icon -->
	<RouterLink
		flex
		justify-start
		items-center
		flex-row
		flex-grow-1
		flex-shrink-1
		gap-3
		link-decoration-none
		:to="{ name: 'intro' }"
	>
		<div>
			<img
				src="../../assets/icon.png"
				alt="website icon"
				border-rounded-full
				w-10
			/>
		</div>
		<h1 text-5 display-none md:block>Time To Review</h1>
	</RouterLink>
</template>

<style scoped lang="scss"></style>
