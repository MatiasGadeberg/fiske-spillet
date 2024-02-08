<template>
  <div class="card border rounded-lg overflow-hidden shadow-md bg-red-100 p-2 m-4 max-w-md">
    <div class="card-header text-lg font-bold py-2 text-center">
      {{ name.charAt(0).toUpperCase() + name.slice(1) }}
    </div>
    <img
      :src="getImageUrl('boat').toString()"
      alt="Product Image"
      class="card-image object-fill w-full h-40 rounded" />
    <div class="current-price text-center text-lg">
      <div>Pris:</div>
      <div class="flex items-center justify-center">
        <div class="font-bold">{{ game.boatMarket[props.name]?.price }} VM$</div>
      </div>
    </div>
        <div class="flex flex-col space-y-4">
        <div class="flex flex-col space-y-1">
          <div class="font-semibold">Lastrum:</div>
          <div class="w-full bg-gray-300 h-4 rounded-full overflow-hidden">
            <div class="bg-green-500 h-full" :style="{ width: `${game.boatMarket[props.name]?.cargo * 10}%` }"></div>
          </div>
        </div>
        <div class="flex flex-col space-y-1">
          <div class="font-semibold">Fart:</div>
          <div class="w-full bg-gray-300 h-4 rounded-full overflow-hidden">
            <div class="bg-green-500 h-full" :style="{ width: `${game.boatMarket[props.name]?.speed  * 10}%` }"></div>
          </div>
        </div>
        <div class="flex flex-col space-y-1">
          <div class="font-semibold">Kan fange:</div>
          <div class="flex space-x-2">
            <span v-for="fish in game.boatMarket[props.name]?.availableFish" :key="fish" class="relative">
              <img :src="getImageUrl('fish', fish).toString()" alt="Fish Icon" class="w-14 h-14" />
            </span>
          </div>
        </div>
      </div>
    <div class="flex justify-between items-center p-4">
      <div>
        <button @click="decrement" class="amount-button">-</button>
      </div>
      <input
        v-model="toBuy"
        type="number"
        class="amount-input text-center w-16 flex-grow appearance-none"
        :max="team.fishInventory[props.name]?.amount"
        :min="0"
        @input="handleInput()"
      />
      <div>
        <button @click="toBuy++" class="amount-button">+</button>
      </div>
    </div>
    <button
      @click="buy"
      :disabled="disabled"
      :class="{ 'bg-gray-300': disabled }"
      class="card-button bg-blue-500 text-white py-2 px-4 mt-2 rounded-md w-full"
    >
      <span v-if="!loading && !expensive">Køb</span>
      <span v-else-if="!loading && expensive">I har ikke råd til {{ toBuy }}</span>
      <span v-else> Køber... </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useGameStore } from '@/stores/game'
import { useTeamStore } from '@/stores/team'

const props = defineProps({
  name: {
    type: String,
    required: true
  }
})

const game = useGameStore()
const team = useTeamStore()

const toBuy = ref(0)
const loading = ref(false)
const expensive = ref(false)
const disabled = ref(false)

const decrement = () => {
  if (toBuy.value > 0) {
    toBuy.value--
  }
}

watchEffect(() => {
    expensive.value = toBuy.value * game.boatMarket[props.name]?.price > team.points
    let isString = typeof(toBuy.value) === 'string'
    disabled.value = expensive.value || isString || loading.value || toBuy.value === 0
})

const handleInput = () => {
  if (toBuy.value <  0) {
    toBuy.value = 0
  }
}

const buy = () => {
    try {
        loading.value = true
        team.buyBoat(props.name, toBuy.value, game.boatMarket[props.name]?.price)
    } finally {
        loading.value = false
    }
}


function getImageUrl(type: string, fishName?: string) {
     let name: string
     if (fishName) {
         name = fishName
     } else {
         name = props.name
     }

  return new URL(`../assets/${type}Images/${name}.svg`, import.meta.url)
}
</script>

<style scoped>
.amount-button {
  @apply bg-blue-500 text-white p-2 m-1 min-w-9 rounded-md cursor-pointer;
}
.amount-input {
  @apply border rounded-md text-center w-16 p-2;
}
</style>
