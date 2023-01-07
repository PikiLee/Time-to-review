<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import type CourseCreator from "./Course/CourseCreator.vue";

const route = useRoute();
const showCourseCreator = computed(() => route.name !== "home");
</script>
<template>
  <div mt-18>
    <CourseCreator v-if="showCourseCreator" />
  </div>
</template>
