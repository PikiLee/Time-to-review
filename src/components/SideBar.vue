<script setup lang="ts">
import { ref } from "vue";

const input = ref("");
const defaultPlaceholder = "New Course Name";
const placeholder = ref(defaultPlaceholder);

function handleCreate() {
  if (!input.value) placeholder.value = "Invalid!";
}
</script>
<template>
  <div py-10 grid grid-cols-1 gap-2 auto-rows-min justify-items-center>
    <el-input
      v-model.trim="input"
      :placeholder="placeholder"
      @focus="placeholder = defaultPlaceholder"
    />
    <el-button round bg-lime-500 @click="handleCreate" type="primary"
      >Create</el-button
    >
  </div>
</template>
