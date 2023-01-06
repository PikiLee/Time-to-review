<script setup lang="ts">
import { useCourses } from "@/database/course";
import { ProgressStage } from "@/types/progress.type";
import { useArrayFind } from "@vueuse/shared";
import { useRoute } from "vue-router";
import { useSetting } from "@/database/setting";
import dayjs from "dayjs/esm";

const courses = useCourses();
const route = useRoute();

const course = useArrayFind(
  courses,
  (course) => course.id === Number(route.params.id)
);

function getFormatedDates(lastTime: number, stage: ProgressStage) {
  const setting = useSetting();
  const lastDate = dayjs(lastTime);
  const nextDate =
    stage === ProgressStage["Reviewed Fourth Times"]
      ? "Done"
      : lastDate
          .add(setting.value.progressStageInterval[stage], "day")
          .format("YYYY-MM-DD");

  return {
    lastDate: lastDate.format("YYYY-MM-DD"),
    nextDate,
  };
}
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
        <span>{{ ProgressStage[progress.stage] }}</span>
        <time>{{
          getFormatedDates(progress.lastDate, progress.stage).lastDate
        }}</time>
        <time>{{
          getFormatedDates(progress.lastDate, progress.stage).nextDate
        }}</time>
      </li>
    </ul>
  </div>
  <el-empty description="Course Not Found." v-else />
</template>

<style scoped></style>
