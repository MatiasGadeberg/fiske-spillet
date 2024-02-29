<template>
    <div  
        class="relative rounded" 
        :class="{ 
            'bg-green-400': props.boat.boatId === team.selectedBoat,
            'hover:scale-110': !props.boat.inUse,
            'hover:outline': !props.boat.inUse
        }"
    >
        <img
            :src="getImageUrl().toString()"
            alt="Product Image"
            class="object-fill w-28 h-20 mx-3 "
            :class="{ grayscale: props.boat.inUse, 'scale-x-[-1]': props.boat.status === 'outbound'}"
        />  
        <div v-if="props.boat.inUse" class="absolute inset-0 w-full flex items-center justify-center z-10">
            <div class="bg-slate-100 opacity-70 rounded px-2 h-min-fit text-black text-m font-bold">
                <p>{{ millisToMinutesAndSeconds(props.boat.timeToDestinationInMs) }}</p>
            </div>
        </div>
    </div>
    
</template>

<script setup lang="ts">
import { useTeamStore } from '@/stores/team';
import type { BoatInfo } from '../../../shared/types/GameTypes';

const props = defineProps<{
    boat: BoatInfo
}>()

const team = useTeamStore()

function millisToMinutesAndSeconds(millis: number | null) {
    if (millis) {
          let minutes = Math.floor(millis / 60000);
          let seconds = ((millis % 60000) / 1000);
          let secondsString = seconds.toFixed(0);

          return (
            seconds === 60 ?
            (minutes+1) + ":00" :
            minutes + ":" + (seconds < 10 ? "0" : "") + secondsString
        );
    } else {
        return '0:00'
    }
}

function getImageUrl() {
    const path = `../assets/boatImages/${props.boat.type}.svg`
  return new URL(path , import.meta.url)
}

</script>
