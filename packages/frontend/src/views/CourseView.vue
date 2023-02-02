<script setup lang="ts">
import AddButton from "../components/AddButton.vue";
import ProgressListItem from "@/components/Progress/ProgressListItem.vue";
import { useCourseStore } from "@/store/course.store";
import { useCustomRouter } from "@/utils/useCustomRouter";

const { id } = useCustomRouter();
const courseStore = useCourseStore();
const course = courseStore.find(id.value);
</script>
<template>
	<AddButton />
	<div v-if="course" data-testid="course-view">
		<h2 text-center>{{ course.name }}</h2>
		<ul list-none v-if="course.progresses.length">
			<li
				grid
				grid-cols-12
				items-center
				border-b
				border-b-warmgray-300
				p-2
				gap-2
			>
				<!-- <span col-span-1>Actions</span> -->
				<span col-span-3>Progress Name</span>
				<span col-span-3>Stage</span>
				<span col-span-3>Last Review Date</span>
				<span col-span-3>Next Review Date</span>
			</li>
			<ProgressListItem
				v-for="progress in course.progresses"
				:key="progress._id"
				:progress="progress"
			/>
		</ul>
		<el-empty v-else description="No progress created yet." />
	</div>
	<el-empty description="Course Not Found." v-else />
</template>

<style scoped></style>
