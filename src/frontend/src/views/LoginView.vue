<template>
  <div class="my-2">
    <h1>Skriv hvilket hold du vil joine</h1>
    <form @submit.prevent="" class="">
      <input
        type="text"
        placeholder="Holdnavn"
        v-model="teamName"
        class="placeholder:text-slate-700 border-2 border-black rounded p-2 mx-3"
      />
      <button @click="auth.login(teamName)" class="rounded-xl bg-slate-400 text-slate700 px-2 py-1">
        Join hold
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const auth = useAuthStore()
const teamName = ref('')
</script>
