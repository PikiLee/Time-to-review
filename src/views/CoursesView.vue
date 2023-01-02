<script setup lang="ts"></script>
<template>
  <div>
    <h2>Course List</h2>
    <ul list-none>
      <li>
        <h3>Progressing</h3>
        <ul list-none grid grid-cols-2 gap-6 p-4>
          <li
            grid
            grid-rows-2
            grid-cols-4
            gap-2
            items-center
            v-for="n in 5"
            :key="n"
          >
            <div
              row-span-2
              i-ic-round-done
              text-size-3xl
              justify-self-center
            ></div>
            <h3 col-span-3 m-0>第一章</h3>
            <div col-span-3>1st review</div>
          </li>
        </ul>
      </li>
      <li><h2>Done</h2></li>
    </ul>
  </div>
</template>

<style scoped></style>
