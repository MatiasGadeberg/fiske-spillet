<template>
      <div class="text-slate-200 text-2xl flex-1 overflow-auto justify-center hover:scale-105 pb-8"
        :class="{ 
            'bg-sky-300': props.area.color === 300,
            'bg-sky-500': props.area.color === 500,
            'bg-sky-700': props.area.color === 700,
        }"
           @click="sendBoat()"
      >
        <div class="flex items-center justify-center flex-col text-base m-4">
            <h1 class="p-2 text-2xl">Område {{ area.areaNumber }}</h1>
        </div>

        <div class="grow">
            <div class="flex flex-col items-center justify-center"> 
                    <div v-for="stock in props.area.fishStocks" :key="stock.name" class="flex justify-center">
                        <img :src="game.getImageUrl('fish', stock.name)" class="w-min-32" />
                        <div>{{ stock.percentAvailable.toFixed(1) }}%</div>
                    </div>
            </div>
        </div>

        <div class="flex justify-center flex-col items-center">
            <InventoryBoat v-for="boat in props.boats" 
                class="max-h-fit"
                :key="boat.boatId" 
                :id="boat.boatId"
                :boat="boat"
            />
        </div>
        
      </div>
</template>

<script setup lang="ts">
import { useTeamStore } from '@/stores/team';
import type { FishAreaInfo, BoatInfo } from '../../../shared/types/GameTypes';
import { useGameStore } from '@/stores/game';

import InventoryBoat from './InventoryBoat.vue'

const props = defineProps<{
    area: FishAreaInfo,
    boats: BoatInfo[],
}>()

const team = useTeamStore();
const game = useGameStore();

const sendBoat = () => {
    if ( team.selectedBoat ) {
        team.sendBoat(props.area.areaNumber, Date.now())
    }
} 

</script>
