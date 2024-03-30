<template>
  <div class="card border rounded-lg overflow-hidden shadow-md bg-red-100 p-2 m-4 max-w-md">
    <div class="card-header text-lg font-bold py-2 text-center">
      {{ props.fish.name.charAt(0).toUpperCase() + props.fish.name.slice(1) }}
    </div>
    <img
      :src="game.getImageUrl('fish', props.fish.name)"
      alt="Product Image"
      class="card-image object-fill w-full h-40 rounded"
    />
    <div class="prices flex justify-between mx-4 text-lg"> 
        <div class="min-price flex flex-col items-center justify-center">
          <div>Min pris:</div>
          <div class="flex items-center justify-center">
            <div class="font-bold">{{props.fish.minPrice}}</div>
          </div>
        </div>
        <div class="current-price text-center ">
          <div>Nuværende pris:</div>
          <div class="flex items-center justify-center">
            <div class="font-bold">{{ props.fish.currentPrice.toLocaleString('da-DK', {maximumFractionDigits: 2, minimumFractionDigits: 2}) }} VM$/Ton</div>
            <div>
              <trending-up
                v-if="props.fish.growth === 'positive'"
                class="text-green-500"
              />
              <trending-down
                v-if="props.fish.growth === 'negative'"
                class="text-red-500"
              />
              <trending-neutral
                v-if="props.fish.growth === 'neutral'"
                class="text-yellow-500"
              />
            </div>
          </div>
        </div>
        <div class="max-price flex flex-col items-center justify-center">
          <div>Max pris:</div>
          <div class="flex items-center justify-center">
            <div class="font-bold">{{props.fish.maxPrice}}</div>
          </div>
        </div>
    </div>
    <div class="team-inventory text-center text-lg">
      <div>Jeres beholdning</div>
      <div class="font-bold">{{ team.fishInventory[props.fish.name]?.amount.toFixed()}} Ton</div>
    </div>
    <div class="flex justify-between items-center p-4">
      <div>
        <button @click="toSell = 0" class="amount-button">--</button>
        <button @click="decrement" class="amount-button">-</button>
      </div>
      <input
        v-model="toSell"
        type="number"
        class="amount-input text-center w-16 flex-grow appearance-none"
        :max="team.fishInventory[props.fish.name]?.amount"
        :min="0"
        @input="handleInput()"
      />
      <div>
        <button @click="increment" class="amount-button">+</button>
        <button @click="toSell = team.fishInventory[props.fish.name]?.amount" class="amount-button">
          ++
        </button>
      </div>
    </div>
    <button
      @click="sell"
      :disabled="toSell === 0 || loading"
      :class="{ 'bg-gray-300': toSell === 0 || loading }"
      class="card-button bg-blue-500 text-white py-2 px-4 mt-2 rounded-md w-full"
    >
      <span v-if="!loading">Sælg</span>
      <span v-else> Sælger... </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TrendingUp from 'vue-material-design-icons/TrendingUp.vue'
import TrendingDown from 'vue-material-design-icons/TrendingDown.vue'
import TrendingNeutral from 'vue-material-design-icons/TrendingNeutral.vue'
import { useTeamStore } from '@/stores/team'
import type { FishMarketEntry } from '../../../shared/types/GameTypes';
import { useGameStore } from '@/stores/game'

const props = defineProps<{
    fish: FishMarketEntry
}>()

const team = useTeamStore()
const game = useGameStore()

const toSell = ref(0)
const loading = ref(false)

const increment = () => {
  if (toSell.value < team.fishInventory[props.fish.name]?.amount) {
    toSell.value++
  }
}

const decrement = () => {
  if (toSell.value > 0) {
    toSell.value--
  }
}

const handleInput = () => {
  // Ensure the entered value does not exceed the maximum
  if (toSell.value > team.fishInventory[props.fish.name]?.amount) {
    toSell.value = team.fishInventory[props.fish.name]?.amount
  }
  if (toSell.value < 0) {
      toSell.value = 0
  }
}

const sell = async () => {
  try {
    loading.value = true
    await team.sellFish(props.fish.name, props.fish.currentPrice, toSell.value)
  } finally {
    toSell.value = 0
    loading.value = false
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
