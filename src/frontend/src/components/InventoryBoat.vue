<template>
    <div class="relative rounded hover:scale-110 hover:outline">
        <img
            :src="getImageUrl().toString()"
            alt="Product Image"
            class="object-fill w-28 h-20 mx-3 "
            :class="{ grayscale: inUse}"
        />  
        <div v-if="inUse" class="absolute inset-0 flex items-center justify-center z-10">
            <div class="bg-slate-100 rounded px-2 h-min-fit text-black text-m font-bold">
                <p>{{ millisToMinutesAndSeconds(props.timeToDestinationInMs) }}</p>
            </div>
        </div>
    </div>
    
</template>

<script setup lang="ts">
import type { BoatInfo } from '../../../shared/types/GameTypes';


const props = defineProps<{
    type: BoatInfo["type"]
    inUse: BoatInfo["inUse"]
    cargo: BoatInfo["cargo"]
    timeToDestinationInMs: BoatInfo["timeToDestinationInMs"]
}>()

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
  return new URL(`../assets/boatImages/${props.type}.svg`, import.meta.url)
}

</script>
