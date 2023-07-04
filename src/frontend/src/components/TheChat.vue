<template>
  <div>
    <h1>Time on server is {{ gameTime }}</h1>
    <h1>Write you message here!</h1>
    <ul>
      <li v-for="message in chatMessages" :key="message.id">
        {{ message.content }}
      </li>
    </ul>

    <input v-model="inputMessage" type="text" placeholder="Enter your message" />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MqttWrapper } from '../../../shared/classes/MqttWrapper.js'
import type { GameInfo } from '../../../shared/types/GameTypes'

const chatMessages = ref([] as { id: number; content: string }[])
const inputMessage = ref('')
const gameTime = ref('')
let mqtt: MqttWrapper

const onConnet = (): void => {
  console.log('Client connected')
  mqtt.subscribeToTopic('game-data')
}

const onMessage = (topic: string, message: any): void => {
  console.log(`Recieved message on topic ${topic}:`)
  console.log(JSON.parse(message))
  switch (topic) {
    case 'game-data':
      updateGameData(JSON.parse(message) as GameInfo)

      break

    default:
      break
  }
}

const connectToBroker = () => {
  mqtt = new MqttWrapper({
    connectionHost: 'localhost',
    connectionType: 'web-mqtt',
    onConnectCallbackFunction: onConnet,
    onMessageCallbackFunction: onMessage
  })
}

const sendMessage = () => {
  const message = inputMessage.value.trim()
  if (message) {
    mqtt.publishToTopic('chat/message', message)
    inputMessage.value = ''
  }
}

const updateGameData = (data: GameInfo): void => {
  gameTime.value = new Date(data.serverTime).toLocaleTimeString()
}

onMounted(() => {
  connectToBroker()
})
</script>
