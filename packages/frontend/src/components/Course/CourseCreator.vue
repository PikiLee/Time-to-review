<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { create as createCourse } from "@/database/course";
import { create as createProgress } from "@/database/progress";
import { useRoute, useRouter } from "vue-router";
import { useCustomRouter } from "@/utils/useCustomRouter";
import { ElMessage } from "element-plus";
import { errorMsg } from "@/utils/useMessage";

const emit = defineEmits(["ok"]);

const route = useRoute();
const router = useRouter();
const { isCoursePage } = useCustomRouter();

const input = ref("");
const defaultPlaceholder = computed(() => {
	return isCoursePage.value ? "New Progress Name" : "New Course Name";
});
const placeholder = ref(defaultPlaceholder.value);
watch(
	defaultPlaceholder,
	(newPlaceholder) => (placeholder.value = newPlaceholder),
	{ immediate: true }
);

const courseId = Array.isArray(route.params.id)
	? route.params.id[0]
	: route.params.id;

async function handleCreate() {
	try {
		if (isCoursePage.value) {
			await createProgress(courseId, input.value);
		} else {
			await createCourse(input.value);
			router.push({ name: "courses" });
		}
		emit("ok");
		ElMessage({
			message: `${isCoursePage ? "Progress" : "Course"} ${
				input.value
			} has been created.`,
			type: "success",
		});
	} catch (err) {
		errorMsg(String(err));
	} finally {
		input.value = "";
	}
}

const buttonType = computed(() => (isCoursePage.value ? "info" : "primary"));
</script>

<template>
	<div
		py-10
		grid
		grid-cols-1
		gap-2
		auto-rows-min
		justify-items-center
		data-testid="course-creator"
	>
		<el-input
			v-model.trim="input"
			:placeholder="placeholder"
			@keyup.enter="handleCreate"
			data-test="add-course-input"
		/>
		<el-button
			:type="buttonType"
			round
			bg-lime-500
			@click="handleCreate"
			data-test="add-course"
			>Create</el-button
		>
	</div>
</template>
