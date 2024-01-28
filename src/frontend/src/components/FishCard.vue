<template>
  <div class="card border rounded-lg overflow-hidden shadow-md bg-green-100 p-2 m-4 max-w-md">
    <div class="card-header text-lg font-bold py-2 text-center">
      {{ name }}
    </div>
    <img
      :src="getImageUrl().toString()"
      alt="Product Image"
      class="card-image w-full h-40 object-cover rounded"
    />
    <div class="current-price text-center text-lg">
      <div>Nuværende pris:</div>
      <div class="flex items-center justify-center">
        <div class="font-bold">{{ currentPrice }} VM$/Ton</div>
        <div>
          <trending-up v-if="growth === 'positive'" class="text-green-500" />
          <trending-down v-if="growth === 'negative'" class="text-red-500" />
          <trending-neutral v-if="growth === 'neutral'" class="text-yellow-500" />
        </div>
      </div>
    </div>
    <div class="team-inventory text-center text-lg">
      <div>Jeres beholdning</div>
      <div class="font-bold">{{ teamAmount }} Ton</div>
    </div>
    <div class="flex justify-between items-center p-4">
      <div>
        <button @click="decrementToMin" class="amount-button">--</button>
        <button @click="decrement" class="amount-button">-</button>
      </div>
      <input
        v-model="toSell"
        type="number"
        class="amount-input text-center w-16 flex-grow appearance-none"
        :max="maxAmount"
        :min="minAmount"
        @input="handleInput()"
      />
      <div>
        <button @click="increment" class="amount-button">+</button>
        <button @click="incrementToMax" class="amount-button">++</button>
      </div>
    </div>
    <button
      @click="sell"
      class="card-button bg-blue-500 text-white py-2 px-4 mt-2 rounded-md w-full"
    >
      Sælg
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TrendingUp from 'vue-material-design-icons/TrendingUp.vue'
import TrendingDown from 'vue-material-design-icons/TrendingDown.vue'
import TrendingNeutral from 'vue-material-design-icons/TrendingNeutral.vue'
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

const toSell = ref(0)
const currentPrice = game.fishMarket[props.name].currentPrice
const growth = game.fishMarket[props.name].growth
const teamAmount = team.fishInventory[props.name].amount
const maxAmount = teamAmount
const minAmount = 0

const increment = () => {
  if (toSell.value < maxAmount) {
    toSell.value++
  }
}

const decrement = () => {
  if (toSell.value > minAmount) {
    toSell.value--
  }
}

const incrementToMax = () => {
  toSell.value = maxAmount
}

const decrementToMin = () => {
  toSell.value = minAmount
}

const sell = () => {
  console.log('SElling fish')
}

const handleInput = () => {
  // Ensure the entered value does not exceed the maximum
  if (toSell.value > maxAmount) {
    toSell.value = maxAmount
  }
}

function getImageUrl() {
  return new URL(`../assets/fishImages/${props.name}.jpg`, import.meta.url)
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