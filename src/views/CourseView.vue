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
    <el-table :data="course.progresses" style="width: 100%">
      <el-table-column prop="name" label="Name">
        <template #default="scope">
          <el-input v-model="scope.row.name" />
        </template>
      </el-table-column>
      <el-table-column prop="stage" label="Stage">
        <template #default="scope">
          <el-select
            v-model="scope.row.stage"
            class="m-2"
            placeholder="Select"
            size="large"
          >
            <el-option
              v-for="(value, key) in ProgressStageObject"
              :key="key"
              :label="key"
              :value="value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="lastDate" label="Last Review Date">
        <template #default="scope">
          <!-- {{ dayjs(scope.row.lastDate).format("YYYY-MM-DD") }} -->
          <el-date-picker
            v-model="scope.row.lastDate"
            type="date"
            placeholder="Pick a day"
            size="small"
          />
        </template>
      </el-table-column>
      <el-table-column prop="nextDate" label="Next Review Date">
        <template #default="scope">
          {{ getNextDate(scope.row.lastDate, scope.row.stage) }}
        </template>
      </el-table-column>
      <el-table-column label="Operations">
        <template #default="scope">
          <el-button
            size="small"
            type="danger"
            @click="
              () => {
                if (course) del(course.id, scope.row.id);
              }
            "
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <ul list-none v-if="course.progresses.length !== 0">
      <li
        grid
        grid-cols-5
        items-center
        border-b
        border-b-warmgray-300
        pb-2
        mb-2
      >
        <span>Actions</span>
        <span>Progress Name</span>
        <span>Stage</span>
        <span>Last Review Date</span>
        <span>Next Review Date</span>
      </li>
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
        <div>
          <button i-ic-round-delete-forever text-2xl hover:text-red></button>
        </div>
        <h3 m-0>{{ progress.name }}</h3>
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
