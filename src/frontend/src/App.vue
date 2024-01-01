<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheHeader from './components/TheHeader.vue'
</script>

<template>
  <div>
    <TheHeader />
    <RouterView />
  </div>
</template>

<style scoped></style>
