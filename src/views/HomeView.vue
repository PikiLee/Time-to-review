<script setup lang="ts">
import DueCourseSection from "@/components/Course/DueCourseSection.vue";
import { useDueCourses } from "@/utils/useDueCourse";

const dueCourses = useDueCourses();
</script>

<template>
  <main>
    <h2>Courses that need review</h2>
    <DueCourseSection
      v-for="course in dueCourses"
      :key="course.id"
      :course="course"
    />
    <el-empty
      description="No courses need review yet."
      v-if="dueCourses.length === 0"
    />
  </main>
</template>
