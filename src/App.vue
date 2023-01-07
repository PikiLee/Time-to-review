<script setup lang="ts">
import { RouterView } from "vue-router";
import AppHeader from "./components/AppHeader.vue";
import SideBar from "./components/SideBar.vue";
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
      <div col-span-9>
        <RouterView />
      </div>
      <SideBar col-span-3 />
    </div>
  </div>
</template>
