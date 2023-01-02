<script setup lang="ts">
import { computed } from "vue";
import { useCourses } from "@/database/course";
import { CourseStatus } from "@/types/course.type";
import CourseCard from "@/components/CourseCard.vue";

const courses = useCourses();
const coursesInProgress = computed(() =>
  courses.value.filter(
    (course) => course.status === CourseStatus["In Progress"]
  )
);
</script>
<template>
  <div>
    <h2>Course List</h2>
    <ul list-none>
      <li>
        <h3>In Progress</h3>
        <CourseCard
          :course="course"
          v-for="course in coursesInProgress"
          :key="course.id"
        />
      </li>
      <li><h2>Done</h2></li>
    </ul>
  </div>
</template>

<style scoped></style>
