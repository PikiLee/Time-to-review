<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
  <div grid grid-cols-12 py-2 gap-8>
    <div col-span-2></div>
    <a
      flex
      justify-start
      items-center
      flex-row
      gap-3
      col-span-4
      link-decoration-none
      href="/"
      alt="home"
    >
      <div>
        <img
          src="../assets/icon.png"
          alt="website icon"
          border-rounded-full
          w-10
        />
      </div>
      <h1 text-sm>Time To Review</h1>
    </a>
    <div col-span-4 flex flex-row gap-4 items-center justify-end>
      <a
        font-600
        text-lg
        link-decoration-none
        hover:text-lime-500
        href="/"
        alt="Home"
        >HOME</a
      >
      <a
        font-600
        text-lg
        link-decoration-none
        hover:text-lime-500
        href="/courses"
        alt="Courses"
        >COURSES</a
      >
    </div>
    <div col-span-2 flex flex-row items-center justify-start self-center>
      <div @click="toggleDark()" cursor-pointer mb="0.125rem">
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
