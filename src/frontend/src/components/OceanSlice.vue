<template>
      <div class="text-slate-200 text-2xl hover:text-3xl flex-1 justify-center hover:scale-x-110"
        :class="{ 
            'bg-sky-300': props.area.color === 300,
            'bg-sky-500': props.area.color === 500,
            'bg-sky-700': props.area.color === 700,
        }"
           @click="sendBoat()"
      >
        <div class="flex justify-center">
            <h1 class="p-2 ">Område {{ area.areaNumber }}</h1>
        </div>

        <div class="grow">
            <div class="flex flex-col items-center"> 
                    <div v-for="stock in props.area.fishStocks" :key="stock.name" class="flex">
                        <img :src="game.getImageUrl('fish', stock.name)" class="w-min-32" />
                        <div>{{ stock.percentAvailable.toFixed(2) }}%</div>
                    </div>
            </div>
        </div>
      </div>
</template>

<script setup lang="ts">
import { useTeamStore } from '@/stores/team';
import type { FishAreaInfo } from '../../../shared/types/GameTypes';
import { useGameStore } from '@/stores/game';

const props = defineProps<{
    area: FishAreaInfo,
}>()

const team = useTeamStore();
const game = useGameStore();

const sendBoat = () => {
    if ( team.selectedBoat ) {
        team.sendBoat(props.area.areaNumber, Date.now())
    }
} 

</script>
