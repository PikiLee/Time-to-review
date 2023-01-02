<script setup lang="ts"></script>

<template>
  <main>
    <div v-for="i in 5" :key="i">
      <h2>计算机网络</h2>
      <section grid grid-cols-2 gap-6 p-4>
        <div
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
        </div>
      </section>
    </div>
  </main>
</template>
