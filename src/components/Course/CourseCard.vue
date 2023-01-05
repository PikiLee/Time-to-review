<script setup lang="ts">
import type { Course } from "@/types/course.type";
import dayjs from "dayjs/esm";
import relativeTime from "dayjs/esm/plugin/relativeTime";
import { computed } from "vue";

dayjs.extend(relativeTime);

const props = defineProps<{
  course: Course;
}>();

const createdTime = computed(() => {
  const now = dayjs();
  const created = dayjs(props.course.createdAt);

  const difference = now.diff(created, "day");

  if (difference < 7) return created.fromNow();
  return created.format("YYYY-MM-DD");
});
</script>

<template>
  <div>
    <li grid grid-rows-2 grid-cols-5 gap-2 items-center>
      <div
        row-span-2
        i-material-symbols-archive
        text-size-3xl
        justify-self-center
        cursor-pointer
        hover:text-lime-500
      ></div>
      <div
        row-span-2
        i-ic-round-done
        text-size-3xl
        justify-self-center
        cursor-pointer
        hover:text-lime-500
      ></div>
      <h3
        col-span-3
        m-0
        data-test="course-name"
        cursor-pointer
        hover:text-lime-500
      >
        {{ course.name }}
      </h3>
      <time col-span-3 :datetime="dayjs(course.createdAt).toISOString()">{{
        createdTime
      }}</time>
    </li>
  </div>
</template>
