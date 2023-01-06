<script setup lang="ts">
import { useCourses } from "@/database/course";
import { useArrayFind } from "@vueuse/shared";
import { useRoute } from "vue-router";

const courses = useCourses();
const route = useRoute();

const course = useArrayFind(
  courses,
  (course) => course.id === Number(route.params.id)
);
</script>
<template>
  <div v-if="course">
    <h2>{{ course.name }}</h2>
    <ul list-none v-if="course.progresses.length !== 0">
      <li
        v-for="progress in course.progresses"
        :key="progress.id"
        grid
        grid-cols-5
        items-center
        border-b
        border-b-warmgray-300
        pb-2
        mb-2
      >
        <div></div>
        <h3 m-0>{{ progress.name }}</h3>
        <span>1st Review</span>
        <time>2022-2-2</time>
        <time>2022-2-2</time>
      </li>
    </ul>
  </div>
  <el-empty description="Course Not Found." v-else />
</template>

<style scoped></style>
