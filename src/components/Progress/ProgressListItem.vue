<script setup lang="ts">
import { ProgressStageObject, type Progress } from "@/types/progress.type";
import { useSetting } from "@/database/setting";
import dayjs from "dayjs/esm";
import { del } from "@/database/progress";
import { useVModel } from "@vueuse/core";
import { computed } from "vue";
import { useDue } from "@/utils/useDue";
import { useCourse } from "@/utils/useCourse";

const props = defineProps<{
  progress: Progress;
}>();
const emit = defineEmits(["update:progress"]);

const data = useVModel(props, "progress", emit);

const course = useCourse();

const nextDate = computed(() => {
  const setting = useSetting();
  const lastDate = dayjs(props.progress.lastDate);
  const nextDate =
    props.progress.stage === ProgressStageObject["Reviewed Fourth Times"]
      ? "Done"
      : lastDate
          .add(setting.value.progressStageInterval[props.progress.stage], "day")
          .format("YYYY-MM-DD");

  return nextDate;
});

const isDue = useDue(nextDate);
</script>

<template>
  <li
    grid
    grid-cols-12
    items-center
    border-b
    border-b-warmgray-300
    py-2
    my-1
    gap-2
    :class="{ 'bg-yellow-300': isDue }"
  >
    <div col-span-1>
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
    <time col-span-3>{{ nextDate }}</time>
  </li>
</template>
