<script setup lang="ts">
import { useDueCourses } from "@/utils/useDueCourse";

const dueCourses = useDueCourses();
</script>

<template>
  <main>
    <h2>Courses that need to review</h2>
    <div v-for="course in dueCourses" :key="course.id">
      <h2>{{ course.name }}</h2>
      <section grid grid-cols-2 gap-6 p-4>
        <div
          grid
          grid-rows-2
          grid-cols-4
          gap-2
          items-center
          v-for="progress in course.progresses"
          :key="progress.id"
        >
          <div
            row-span-2
            i-ic-round-done
            text-size-3xl
            justify-self-center
          ></div>
          <h3 col-span-3 m-0>{{ progress.name }}</h3>
          <div col-span-3>{{ progress.stage }}</div>
        </div>
      </section>
    </div>
  </main>
</template>
