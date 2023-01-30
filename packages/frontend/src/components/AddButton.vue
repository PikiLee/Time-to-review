<script setup lang="ts">
import { useCustomRouter } from "@/utils/useCustomRouter";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { computed, ref } from "vue";
import CourseCreator from "./Course/CourseCreator.vue";

const dialogVisible = ref(false);
const breakpoints = useBreakpoints(breakpointsTailwind);
const largerThanMd = breakpoints.greater("md");

const { isCoursePage } = useCustomRouter();
const toolTip = computed(() =>
  isCoursePage.value ? "Create Progress" : "Create Course"
);
const buttonType = computed(() => (isCoursePage.value ? "info" : "primary"));
</script>

<template>
  <el-tooltip effect="dark" :content="toolTip" placement="left">
    <el-button
      :type="buttonType"
      circle
      fixed
      right-10
      bottom-10
      size="large"
      @click="dialogVisible = true"
    >
      <template #icon>
        <div i-mdi-add></div>
      </template>
    </el-button>
  </el-tooltip>

  <el-dialog
    v-model="dialogVisible"
    title="Create"
    :width="largerThanMd ? '40%' : '90%'"
  >
    <CourseCreator @ok="dialogVisible = false" />
  </el-dialog>
</template>

<style lang=""></style>
