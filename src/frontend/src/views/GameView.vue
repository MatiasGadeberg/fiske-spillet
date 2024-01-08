<template>
  <div class="game-view min-h-screen">
    <div class="flex">
      <router-link to="/game/boat" class="flex-grow">
        <div class="bg-red-500 p-2 text-center hover:bg-red-600 text-white">Boat</div>
      </router-link>
      <router-link to="/game/fish" class="flex-grow">
        <div class="bg-green-500 p-2 text-center hover:bg-green-600 text-white">Fish</div>
      </router-link>
      <router-link to="/game/ocean" class="flex-grow">
        <div class="bg-blue-500 p-2 text-center hover:bg-blue-600 text-white">Ocean</div>
      </router-link>
    </div>

    <router-view class="mt-4" />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
