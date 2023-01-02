<script setup lang="ts">
import type { Course } from "@/types/course.type";

defineProps<{
  course: Course;
}>();
</script>

<template>
  <div>
    <ul list-none grid grid-cols-2 gap-6 p-4>
      <li grid grid-rows-2 grid-cols-4 gap-2 items-center>
        <div row-span-2 i-ic-round-done text-size-3xl justify-self-center></div>
        <h3 col-span-3 m-0>{{ course.name }}</h3>
        <div col-span-3>{{ course.createdAt }}</div>
      </li>
    </ul>
  </div>
</template>
