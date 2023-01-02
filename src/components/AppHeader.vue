<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
  <div grid grid-cols-6 py-2>
    <div></div>
    <div flex justify-start items-center flex-row gap-3 col-span-4>
      <div>
        <img
          src="../assets/icon.png"
          alt="website icon"
          border-rounded-full
          w-10
        />
      </div>
      <h1 text-sm>Time To Review</h1>
    </div>
    <div flex flex-row items-center justify-start self-center>
      <div @click="toggleDark()" cursor-pointer>
        <span
          text-xl
          text-warmgray-100
          i-material-symbols-dark-mode
          v-if="isDark"
        />
        <span text-xl text-warmgray-700 i-material-symbols-light-mode v-else />
      </div>
    </div>
  </div>
</template>
