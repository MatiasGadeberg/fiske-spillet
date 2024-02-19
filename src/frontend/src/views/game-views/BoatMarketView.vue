<script setup lang="ts">
import BoatCard from '../../components/BoatCard.vue'

const boatArray = [
    {
        name: 'kutter',
    },
    {
        name: 'fiskeskib',
    },
    {
        name: 'hummerskib',
    },
    {
        name: 'trawler',
    }
]
</script>

<template>
  <div class="bg-violet-500 ">
    <div>
      <div class="flex justify-center flex-col items-center text-slate-200 m-5">
        <h1 class="font-bold text-4xl m-3">Velkommen til Rederiet</h1>
        <h2 class="text-2xl">Her kan I købe flere både til jeres beholding</h2>
      </div>
      <div class="boat-card-container flex flex-wrap">
        <div v-for="boat in boatArray" :key="boat.name" class="boat-card flex-grow">
          <BoatCard :name="boat.name" />
        </div>
      </div>
      <ul></ul>
    </div>
  </div>
</template>

<style scoped></style>
