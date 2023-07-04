<template>
  <div>
    <h1 class="text-lg p-6">Time on server is {{ gameTime }}</h1>
    <h1>Write you message here!</h1>
    <ul>
      <li v-for="message in chatMessages" :key="message.id">
        {{ message.content }}
      </li>
    </ul>

    <input v-model="inputMessage" type="text" placeholder="Enter your message" />
    <button class="p-2 m-3 rounded-xl bg-slate-400">Send</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const chatMessages = ref([] as { id: number; content: string }[])
const inputMessage = ref('')
const gameTime = ref('')
</script>
