<template>
  <div class="game-view min-h-screen">
    <div class="flex">
      <router-link to="/game/boat" class="flex-grow">
        <div class="bg-red-300 p-2 text-center hover:bg-red-600 text-white">Rederiet</div>
      </router-link>
      <router-link to="/game/fish" class="flex-grow">
        <div class="bg-green-300 p-2 text-center hover:bg-green-600 text-white">Fiskemarkedet</div>
      </router-link>
      <router-link to="/game/ocean" class="flex-grow">
        <div class="bg-blue-300 p-2 text-center hover:bg-blue-600 text-white">Havet</div>
      </router-link>
    </div>

    <router-view class="" />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
