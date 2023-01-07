<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { ref } from "vue";
import { RouterView } from "vue-router";
import AppHeader from "./components/AppHeader.vue";
import CourseCreator from "./components/Course/CourseCreator.vue";
import SideBar from "./components/SideBar.vue";

const dialogVisible = ref(false);
const breakpoints = useBreakpoints(breakpointsTailwind);
const largerThanMd = breakpoints.greater("md");
</script>

<template>
  <div
    bg-warmgray-100
    min-w-full
    min-h-screen
    text-xs
    prose
    dark:prose-invert
    prose-warmgray
    dark:bg-warmgray-800
  >
    <AppHeader />
    <div w-4xl max-w-screen mx-auto px-8 grid grid-cols-12 gap-4>
      <div col-span-12 md:col-span-9>
        <RouterView />
      </div>
      <SideBar col-span-3 display-none md:block />
    </div>
  </div>

  <el-button
    type="primary"
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

  <el-dialog
    v-model="dialogVisible"
    title="Create"
    :width="largerThanMd ? '40%' : '90%'"
  >
    <CourseCreator @ok="dialogVisible = false" />
  </el-dialog>
</template>
