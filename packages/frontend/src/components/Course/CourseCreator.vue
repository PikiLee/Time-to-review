<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { create as createCourse } from "@/database/course";
import { create as createProgress } from "@/database/progress";
import { useRoute, useRouter } from "vue-router";
import { useCustomRouter } from "@/utils/useCustomRouter";
import { ElMessage } from "element-plus";

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

function handleCreate() {
  try {
    if (isCoursePage.value) {
      createProgress(Number(route.params.id), input.value);
    } else {
      createCourse(input.value);
      router.push({ name: "courses" });
    }
    emit("ok");
    ElMessage({
      message: `${isCoursePage ? "Progress" : "Course"} ${
        input.value
      } has been created.`,
      type: "success",
    });
  } catch (error) {
    placeholder.value = String(error);
  } finally {
    input.value = "";
  }
}

const buttonType = computed(() => (isCoursePage.value ? "info" : "primary"));
</script>

<template>
  <div py-10 grid grid-cols-1 gap-2 auto-rows-min justify-items-center>
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
