<template>
  <div
    v-if="auth.isLoggedIn"
    class="bg-indigo-700 flex justify-between min-h-16 items-center px-4 sm:px-6 lg:px-8"
  >
    <h1 class="text-slate-300 font-bold text-lg">VM oplevelses dag: Ta med ud og fisk</h1>
    <h1 class="text-slate-300 font-bold text-lg">Logget på som: {{ team.teamId }}</h1>
    <h1 class="text-slate-300 font-bold text-lg">Jeres hold har {{ team.points }} vm$</h1>
  </div>
  <div v-else class="bg-indigo-700 flex justify-between min-h-16 items-center px-4 sm:px-6 lg:px-8">
    <h1 class="text-slate-300 font-bold text-lg">VM oplevelses dag: Ta med ud og fisk</h1>
  </div>
</template>

<script setup lang="ts">
import { useTeamStore } from '@/stores/team'
import { useAuthStore } from '@/stores/auth'
const team = useTeamStore()
const auth = useAuthStore()
</script>

<style scoped></style>
