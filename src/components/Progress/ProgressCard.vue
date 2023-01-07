<script setup lang="ts">
import {
  ProgressStageObjectReversed,
  type Progress,
} from "@/types/progress.type";

defineProps<{
  progress: Progress;
}>();
</script>

<template>
  <div grid grid-rows-2 grid-cols-4 gap-2 items-center>
    <div row-span-2 i-ic-round-done text-size-3xl justify-self-center></div>
    <h3 col-span-3 m-0>{{ progress.name }}</h3>
    <div col-span-3>
      {{ ProgressStageObjectReversed[progress.stage] }}
    </div>
  </div>
</template>
