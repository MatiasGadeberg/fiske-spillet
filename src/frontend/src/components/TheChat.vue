<template>
  <div>
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

<script lang="ts">
import { ref, onMounted } from 'vue'
import { MqttWrapper } from '../../../shared/classes/MqttWrapper.js'

export default {
  name: 'ChatComponent',
  setup() {
    const chatMessages = ref([] as { id: number; content: string }[])
    const inputMessage = ref('')
    let mqtt: MqttWrapper

    const onConnet = (): void => {
      console.log('Client connected')
      mqtt.subscribeToTopic('chat/message')
    }

    const onMessage = (topic: string, message: any): void => {
      chatMessages.value.push({ id: Date.now(), content: message.toString() })
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

    onMounted(() => {
      connectToBroker()
    })

    return {
      chatMessages,
      inputMessage,
      sendMessage
    }
  }
}
</script>
