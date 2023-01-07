<script setup lang="ts">
import { ref, computed, watch, unref } from "vue";
import { create as createCourse } from "@/database/course";
import { create as createProgress } from "@/database/progress";
import { useRoute } from "vue-router";

const route = useRoute();
const input = ref("");
const defaultPlaceholder = computed(() => {
  return route.name === "course" ? "New Progress Name" : "New Course Name";
});
const placeholder = ref(unref(defaultPlaceholder));
watch(
  defaultPlaceholder,
  (newPlaceholder) => (placeholder.value = newPlaceholder)
);

function handleCreate() {
  try {
    if (route.name === "course") {
      createProgress(Number(route.params.id), input.value);
    } else {
      createCourse(input.value);
    }
  } catch (error) {
    placeholder.value = String(error);
  } finally {
    input.value = "";
  }
}
</script>

<template>
  <div py-10 grid grid-cols-1 gap-2 auto-rows-min justify-items-center>
    <el-input
      v-model.trim="input"
      :placeholder="placeholder"
      @focus="placeholder = defaultPlaceholder"
      @keyup.enter="handleCreate"
      data-test="add-course-input"
    />
    <el-button
      round
      bg-lime-500
      @click="handleCreate"
      type="primary"
      data-test="add-course"
      >Create</el-button
    >
  </div>
</template>
