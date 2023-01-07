<script setup lang="ts">
import {
  ProgressStageObjectReversed,
  type ProgressStage,
} from "@/types/progress.type";

defineProps<{
  name: string;
  stage: ProgressStage;
}>();
</script>

<template>
  <div grid grid-rows-2 grid-cols-1 gap-2 items-center>
    <h3 m-0>{{ name }}</h3>
    <div>
      {{ ProgressStageObjectReversed[stage] }}
    </div>
  </div>
</template>
