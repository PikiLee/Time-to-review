<script setup lang="ts">
import { useCourses } from "@/database/course";
import { useArrayFind } from "@vueuse/shared";
import { useRoute } from "vue-router";
import ProgressListItem from "@/components/Progress/ProgressListItem.vue";

const courses = useCourses();
const route = useRoute();

const course = useArrayFind(
  courses,
  (course) => course.id === Number(route.params.id)
);
</script>
<template>
  <div v-if="course">
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
        :key="progress.id"
        :courseId="course.id"
        :progress="progress"
      />
    </ul>
    <el-empty v-else description="No progress created yet." />
  </div>
  <el-empty description="Course Not Found." v-else />
</template>

<style scoped></style>
