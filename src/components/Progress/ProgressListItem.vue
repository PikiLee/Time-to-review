<script setup lang="ts">
import {
  ProgressStageObject,
  type Progress,
  type ProgressStage,
} from "@/types/progress.type";
import { useSetting } from "@/database/setting";
import dayjs from "dayjs/esm";
import { del } from "@/database/progress";
import { useVModel } from "@vueuse/core";

const props = defineProps<{
  courseId: number;
  progress: Progress;
}>();
const emit = defineEmits(["update:progress"]);

const data = useVModel(props, "progress", emit);

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
</script>

<template>
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
    <div col-span-1>
      <button
        i-ic-round-delete-forever
        text-2xl
        hover:text-red
        @click="del(courseId, progress.id)"
      ></button>
    </div>
    <h3 m-0 col-span-2>
      <el-input v-model="data.name" />
    </h3>
    <div col-span-3>
      <div p-1>
        <el-select v-model="data.stage">
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
      <el-date-picker
        v-model="data.lastDate"
        type="date"
        placeholder="Pick a day"
        :style="{ width: '100%' }"
        :clearable="false"
      />
    </time>
    <time col-span-3>{{
      getFormatedDates(progress.lastDate, progress.stage).nextDate
    }}</time>
  </li>
</template>
