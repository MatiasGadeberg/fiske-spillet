<template>
  <div class="flex justify-center items-center flex-col">
    <div class="w-full grow flex overflow-hidden">
      <div class="flex-1 w-20 flex flex-col items-center overflow-auto overflow-auto bg-emerald-500">
        <h1 class="p-2 text-slate-200 text-2xl">Havnen</h1>
        <div class="w-full flex flex-col items-center">
            <InventoryBoat v-for="boat in team.boatInventory.filter((boat) => !boat.inUse)" 
                class="h-16"
                :key="boat.boatId" 
                :id="boat.boatId"
                :boat="boat"
                @click="updateSelected($event, boat.inUse)"
            />
        </div>
      </div>
      <OceanSlice v-for="fishArea in game.fishAreas"
            :key="fishArea.areaNumber"
            :boats="team.boatInventory.filter((boat) => boat.destination === fishArea.areaNumber)"
            :area="fishArea"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game';
import InventoryBoat from '../../components/InventoryBoat.vue'
import OceanSlice from '../../components/OceanSlice.vue'
import { useTeamStore } from '@/stores/team';

const team = useTeamStore();
const game = useGameStore();

const updateSelected = (e: any, inUse: boolean) => {
    if (!inUse) {
        let sourceId: string
            if (e.srcElement.id) {
                sourceId = e.srcElement.id
            } else {
                sourceId = e.srcElement.offsetParent.id
            }
        team.updateSelectedBoat(sourceId)
    }
}
</script>
