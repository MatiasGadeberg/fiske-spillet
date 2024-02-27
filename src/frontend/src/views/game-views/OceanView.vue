<template>
  <div class="flex justify-center items-center flex-col">
    <div class="w-full grow flex overflow-hidden">
      <div class="flex-1 flex justify-center bg-emerald-500">
        <h1 class="p-2 text-slate-200 text-2xl">Havnen</h1>
      </div>
      <div class="text-slate-200 text-2xl hover:text-3xl flex-1 flex justify-center bg-sky-300 hover:scale-x-110 transition ease-in-out"
           @click="sendBoat(1)"
      >
        <h1 class="p-2 ">Område 1</h1>
      </div>
      <div @click="sendBoat(2)" class="text-slate-200 text-2xl hover:text-3xl h-full flex justify-center flex-1 bg-sky-500 hover:scale-x-110 transition ease-in-out">
        <h1 class="p-2 ">Område 2</h1>
      </div>
      <div @click="sendBoat(3)" class="text-slate-300 text-2xl flex-1 hover:text-3xl flex justify-center bg-sky-700 hover:scale-x-110 transition ease-in-out">
        <h1 class="p-2">Område 3</h1>
      </div>
    </div>
    <div class="flex bg-slate-300 overflow-x-auto overflow-y-visible min-h-28 w-full items-center pl-4">
        <InventoryBoat v-for="boat in team.boatInventory" 
            :key="boat.boatId" 
            :id="boat.boatId"
            :boat="boat"
            @click="updateSelected"
        />
    </div>
  </div>
</template>

<script setup lang="ts">
import InventoryBoat from '../../components/InventoryBoat.vue'
import { useTeamStore } from '@/stores/team';

const team = useTeamStore();

const updateSelected = (e: any) => {
    let sourceId: string
    if (e.srcElement.id) {
        sourceId = e.srcElement.id
    } else {
        sourceId = e.srcElement.offsetParent.id
    }

    team.updateSelectedBoat(sourceId)
}

const sendBoat = (areaNumber: number) => {
    if ( team.selectedBoat ) {
        team.sendBoat(areaNumber)
    }
} 

</script>
