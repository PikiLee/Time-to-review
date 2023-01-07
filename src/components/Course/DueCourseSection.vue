<script setup lang="ts">
import ProgressCard from "@/components/Progress/ProgressCard.vue";
import type { Course } from "@/types/course.type";
import { getIsDue } from "@/utils/useDue";
import { getNextDate } from "@/utils/useNextDate";
import { useArrayFilter } from "@vueuse/shared";

const props = defineProps<{
  course: Course;
}>();

const dueProgresses = useArrayFilter(props.course.progresses, (progress) => {
  const nextDate = getNextDate(progress.lastDate, progress.stage);
  return getIsDue(nextDate);
});
</script>

<template>
  <div>
    <RouterLink
      link-decoration-none
      :to="{ name: 'course', params: { id: course.id } }"
    >
      <h2 hover:text-lime-500>{{ course.name }}</h2>
    </RouterLink>
    <section grid grid-cols-2 gap-6 p-4>
      <ProgressCard
        v-for="progress in dueProgresses"
        :key="progress.id"
        :name="progress.name"
        :stage="progress.stage"
      />
    </section>
  </div>
</template>
