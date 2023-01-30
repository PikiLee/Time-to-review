<script setup lang="ts">
import {
  ProgressStageObject,
  ProgressStageObjectReversed,
  type Progress,
  type ProgressStage,
} from "@/types/progress.type";
import { del } from "@/database/progress";
import { useVModel } from "@vueuse/core";
import { useDue } from "@/utils/useDue";
import { useCourse } from "@/utils/useCourse";
import { useNextDate } from "@/utils/useNextDate";
import { watch, ref } from "vue";
import dayjs from "dayjs/esm";

const props = defineProps<{
  progress: Progress;
}>();
const emit = defineEmits(["update:progress"]);

const showEditor = ref(false);

const data = useVModel(props, "progress", emit);
const lastDate = ref("");
const stage = ref<ProgressStage>(0);
watch(
  () => props.progress,
  (newProgress) => {
    lastDate.value = newProgress.lastDate;
    stage.value = newProgress.stage;
  },
  { immediate: true }
);

const course = useCourse();
const nextDate = useNextDate(lastDate, stage);
const isDue = useDue(nextDate);
</script>

<template>
  <li
    grid
    grid-cols-12
    items-center
    border-b
    border-b-warmgray-300
    p-2
    gap-2
    cursor-pointer
    :class="{ 'bg-yellow-300 dark:bg-yellow-800': isDue }"
    :id="progress.name"
    @click="showEditor = !showEditor"
  >
    <h3 m-0 col-span-3>{{ progress.name }}</h3>
    <div col-span-3>
      {{ ProgressStageObjectReversed[progress.stage] }}
    </div>
    <time col-span-3>
      {{ dayjs(progress.lastDate).format("YYYY-MM-DD") }}
    </time>
    <time col-span-3>{{ nextDate }}</time>
  </li>

  <li
    grid
    grid-cols-12
    items-center
    border-b
    border-b-warmgray-300
    p-2
    py-6
    gap-2
    :class="{ 'bg-yellow-300 dark:bg-yellow-800': isDue }"
    :id="progress.name"
    v-if="showEditor"
  >
    <div col-span-6>Actions</div>
    <div col-span-6 grid place-items-start>
      <button
        i-ic-round-delete-forever
        text-2xl
        hover:text-red
        @click="
          () => {
            if (course) del(course.id, progress.id);
          }
        "
      ></button>
    </div>
    <div col-span-6>Progress Name</div>
    <h3 m-0 col-span-5>
      <el-input v-model="data.name" />
    </h3>
    <div col-span-6>Stage</div>
    <div col-span-5>
      <el-select v-model="data.stage">
        <el-option
          v-for="(value, key) in ProgressStageObject"
          :key="key"
          :label="key"
          :value="value"
        />
      </el-select>
    </div>
    <div col-span-6>Last Review Date</div>
    <time col-span-6>
      <el-date-picker
        v-model="data.lastDate"
        type="date"
        placeholder="Pick a day"
        :style="{ width: '100%' }"
        :clearable="false"
      />
    </time>
  </li>
</template>
