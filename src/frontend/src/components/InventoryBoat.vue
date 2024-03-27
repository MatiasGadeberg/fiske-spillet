<template>
    <div  
        class="relative rounded flex flex-col items-center h-fit" 
        :class="{ 
            'bg-green-400': props.boat.boatId === team.selectedBoat,
            'hover:scale-110': !props.boat.inUse,
            'hover:outline': !props.boat.inUse
        }"
    >
        <img
            :src="game.getImageUrl('boat', props.boat.type)"
            alt="Product Image"
            class="w-3/5 h-auto"
            :class="{  'scale-x-[-1]': props.boat.status === 'outbound'}"
        />  
        <h1 class="mx-2" :class="{'text-sm': props.boat.inUse}">{{ props.boat.name }}</h1>
        <div v-if="props.boat.inUse" class="absolute inset-0 w-full flex items-center justify-center z-10">
            <div class="bg-slate-100 opacity-70 rounded px-2 h-min-fit text-black text-sm font-bold">
                <p>{{ formattedTime }}</p>
            </div>
        </div>
    </div>
    
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { BoatInfo } from '../../../shared/types/GameTypes';
import { useGameStore } from '@/stores/game';
import { useTeamStore } from '@/stores/team';

const props = defineProps<{
    boat: BoatInfo
}>()

const team = useTeamStore()
const game = useGameStore()

function millisToMinutesAndSeconds(millis: number | null) {
    if (millis) {
          let minutes = Math.floor(millis / 60000);
          let seconds = Math.floor((millis % 60000) / 1000);
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

const endTime = props.boat.endTime

const timeLeft = ref(getTimeLeft())

function getTimeLeft() {
    if (endTime) {
        const diff = endTime - Date.now()
        return diff < 0 ? 0 : diff
    } else {
        return 0 
    }
}

const formattedTime = ref('')

watch(timeLeft, () => {
  formattedTime.value = millisToMinutesAndSeconds(timeLeft.value)
})

onMounted(() => {
  const intervalId = setInterval(() => {
    timeLeft.value = getTimeLeft()
  }, 1000)

  // Clear interval on component unmount
  return () => clearInterval(intervalId)
})

</script>
