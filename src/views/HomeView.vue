<script setup lang="ts">
import DueCourseSection from "@/components/Course/DueCourseSection.vue";
import { useDueCourses } from "@/utils/useDueCourse";

const dueCourses = useDueCourses();
</script>

<template>
  <main>
    <h2>Courses that need to review</h2>
    <DueCourseSection
      v-for="course in dueCourses"
      :key="course.id"
      :course="course"
    />
  </main>
</template>
