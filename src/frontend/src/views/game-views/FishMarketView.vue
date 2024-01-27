<script setup lang="ts">
import FishCard from '../../components/FishCard.vue'
const fishArray = [
  {
    name: 'Torsk',
    image: 'torsk'
  },
  {
    name: 'Sild',
    image: 'sild'
  }
]
</script>

<template>
  <div class="bg-green-300 min-h-screen">
    <div>
      <h1>Velkommen til fiskemarkedet - her kan I sælge jeres fisk</h1>
      <ul>
        <li v-for="fish in fishArray" :key="fish.name">
          <FishCard :name="fish.name" :image="fish.image" />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
