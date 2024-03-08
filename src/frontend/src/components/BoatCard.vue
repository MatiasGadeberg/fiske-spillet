<template>
  <div class="card border rounded-lg overflow-hidden shadow-md bg-violet-100 p-2 m-4 max-w-md">
    <div class="card-header text-lg font-bold py-2 text-center">
      {{ props.boat.type.charAt(0).toUpperCase() + props.boat.type.slice(1) }}
    </div>
    <img
      :src="game.getImageUrl('boat', props.boat.type)"
      alt="Product Image"
      class="card-image object-fill w-full h-40 rounded" />
    <div class="current-price text-center text-lg">
      <div>Pris:</div>
      <div class="flex items-center justify-center">
        <div class="font-bold">{{ boatPrice.toLocaleString('da-DK', {maximumFractionDigits: 2, minimumFractionDigits: 2}) }} VM$</div>
      </div>
    </div>
        <div class="flex flex-col space-y-4">
        <div class="flex flex-col space-y-1">
          <div class="font-semibold">Lastrum:</div>
          <div class="w-full bg-gray-300 h-4 rounded-full overflow-hidden">
            <div class="bg-green-500 h-full" :style="{ width: `${props.boat.cargo * 10}%` }"></div>
          </div>
        </div>
        <div class="flex flex-col space-y-1">
          <div class="font-semibold">Fart:</div>
          <div class="w-full bg-gray-300 h-4 rounded-full overflow-hidden">
            <div class="bg-green-500 h-full" :style="{ width: `${props.boat.speed  * 10}%` }"></div>
          </div>
        </div>
        <div class="flex flex-col space-y-1">
          <div class="font-semibold">Kan fange:</div>
          <div class="flex space-x-2">
            <span v-for="fish in props.boat.availableFish" :key="fish" class="relative">
              <img :src="game.getImageUrl('fish', fish)" alt="Fish Icon" class="w-14 h-14" />
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
import { computed, ref, watchEffect } from 'vue'
import { useTeamStore } from '@/stores/team'
import type { BoatMarket } from '../../../shared/types/GameTypes';
import { useGameStore } from '@/stores/game';

const props = defineProps<{
    boat: BoatMarket
}>()

const team = useTeamStore()
const game = useGameStore()

const toBuy = ref(0)
const loading = ref(false)
const expensive = ref(false)
const disabled = ref(false)

const boatPrice = computed(() => {
    return props.boat.price * (1 + Math.floor(team.boatInventory.length / 5) * 0.05)
})

const decrement = () => {
  if (toBuy.value > 0) {
    toBuy.value--
  }
}

watchEffect(() => {
    expensive.value = toBuy.value * props.boat.price > team.points
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
        team.buyBoat(props.boat.type, toBuy.value, boatPrice.value)
    } finally {
        loading.value = false
        toBuy.value = 0
    }
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
