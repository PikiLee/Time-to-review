<script setup lang="ts">
import ProgressCard from "@/components/Progress/ProgressCard.vue";
import { useDueCourses } from "@/utils/useDueCourse";

const dueCourses = useDueCourses();
</script>

<template>
  <main>
    <h2>Courses that need to review</h2>
    <div v-for="course in dueCourses" :key="course.id">
      <RouterLink
        link-decoration-none
        :to="{ name: 'course', params: { id: course.id } }"
      >
        <h2 hover:text-lime-500>{{ course.name }}</h2>
      </RouterLink>
      <section grid grid-cols-2 gap-6 p-4>
        <ProgressCard
          v-for="progress in course.progresses"
          :key="progress.id"
          :progress="progress"
        />
      </section>
    </div>
  </main>
</template>
