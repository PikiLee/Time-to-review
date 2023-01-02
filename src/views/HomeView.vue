<script setup lang="ts"></script>

<template>
  <main>
    Time to Review
    <div v-for="i in 5" :key="i">
      <h2>计算机网络</h2>
      <section grid grid-cols-2 gap-2 p-4>
        <div grid grid-rows-2 grid-cols-6 v-for="n in 5" :key="n">
          <span row-span-2>icon</span>
          <h3 col-span-5>第一章</h3>
          <div col-span-5>1st review</div>
        </div>
      </section>
    </div>
  </main>
</template>
