<script setup lang="ts">
import { useCourses } from "@/database/course";
import { ProgressStageObject, type ProgressStage } from "@/types/progress.type";
import { useArrayFind } from "@vueuse/shared";
import { useRoute } from "vue-router";
import { useSetting } from "@/database/setting";
import dayjs from "dayjs/esm";
import { del } from "@/database/progress";

const courses = useCourses();
const route = useRoute();

const course = useArrayFind(
  courses,
  (course) => course.id === Number(route.params.id)
);

function getFormatedDates(lastTime: string, stage: ProgressStage) {
  const setting = useSetting();
  const lastDate = dayjs(lastTime);
  const nextDate =
    stage === ProgressStageObject["Reviewed Fourth Times"]
      ? "Done"
      : lastDate
          .add(setting.value.progressStageInterval[stage], "day")
          .format("YYYY-MM-DD");

  return {
    lastDate: lastDate.format("YYYY-MM-DD"),
    nextDate,
  };
}

function getNextDate(lastTime: number, stage: ProgressStage) {
  const setting = useSetting();
  const lastDate = dayjs(lastTime);
  const nextDate =
    stage === ProgressStageObject["Reviewed Fourth Times"]
      ? "Done"
      : lastDate
          .add(setting.value.progressStageInterval[stage], "day")
          .format("YYYY-MM-DD");

  return nextDate;
}
</script>
<template>
  <div v-if="course">
    <h2>{{ course.name }}</h2>
    <ul list-none v-if="course.progresses.length !== 0">
      <li
        grid
        grid-cols-12
        items-center
        border-b
        border-b-warmgray-300
        pb-2
        mb-2
        gap-2
      >
        <span col-span-1>Actions</span>
        <span col-span-2>Progress Name</span>
        <span col-span-3>Stage</span>
        <span col-span-3>Last Review Date</span>
        <span col-span-3>Next Review Date</span>
      </li>
      <li
        v-for="progress in course.progresses"
        :key="progress.id"
        grid
        grid-cols-12
        items-center
        border-b
        border-b-warmgray-300
        pb-2
        mb-2
        gap-2
      >
        <div col-span-1>
          <button i-ic-round-delete-forever text-2xl hover:text-red></button>
        </div>
        <h3 m-0 col-span-2>
          <!-- <template>
            {{ progress.name }}
          </template> -->
          <el-input v-model="progress.name" />
        </h3>
        <div col-span-3>
          <!-- {{ progress.stage }} -->
          <div p-1>
            <el-select v-model="progress.stage">
              <el-option
                v-for="(value, key) in ProgressStageObject"
                :key="key"
                :label="key"
                :value="value"
              />
            </el-select>
          </div>
        </div>
        <time col-span-3>
          <!-- {{ getFormatedDates(progress.lastDate, progress.stage).lastDate }} -->
          <el-date-picker
            v-model="progress.lastDate"
            type="date"
            placeholder="Pick a day"
            :style="{ width: '100%' }"
          />
        </time>
        <time col-span-3>{{
          getFormatedDates(progress.lastDate, progress.stage).nextDate
        }}</time>
      </li>
    </ul>
  </div>
  <el-empty description="Course Not Found." v-else />
</template>

<style scoped></style>
