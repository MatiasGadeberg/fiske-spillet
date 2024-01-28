<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheHeader from './components/TheHeader.vue'
</script>

<template>
  <div class="bg-slate-200 app-container font-sans">
    <TheHeader />
    <RouterView />
  </div>
</template>

<style scoped></style>
