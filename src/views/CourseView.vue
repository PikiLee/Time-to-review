<script setup lang="ts"></script>
<template>
  <div>
    <h2>计算机网络原理</h2>
    <ul list-none>
      <li
        grid
        grid-cols-5
        items-center
        border-b
        border-b-warmgray-300
        pb-2
        mb-2
        v-for="n in 10"
        :key="n"
      >
        <div>icon</div>
        <h3 m-0>第一章</h3>
        <span>1st Review</span>
        <time>2022-2-2</time>
        <time>2022-2-2</time>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
