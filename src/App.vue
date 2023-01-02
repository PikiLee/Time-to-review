<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <div
    bg-warmgray-100
    min-w-full
    min-h-screen
    text-sm
    prose
    dark:prose-invert
    prose-truegray
    dark:bg-warmgray-800
  >
    <div w-3xl max-w-screen ma-auto pa-8 >
      <RouterView />
    </div>
  </div>
</template>
