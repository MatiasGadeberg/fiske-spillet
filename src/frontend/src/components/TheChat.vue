<template>
  <div>
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
import { Client as MQTTClient, Message } from 'paho-mqtt'

export default {
  name: 'ChatComponent',
  setup() {
    const chatMessages = ref([] as { id: number; content: string }[])
    const inputMessage = ref('')
    let client: MQTTClient | null = null

    const connectToBroker = () => {
      const host = 'localhost' // Replace with your RabbitMQ MQTT WebSocket URL
      const port = 15675
      const path = '/ws'
      const clientId = `client-${Date.now()}`

      client = new MQTTClient(host, port, path, clientId)
      client.connect({
        onSuccess: () => {
          client!.subscribe('chat/message')
        },
        useSSL: false,
        timeout: 3,
        onFailure: (error) => {
          console.error('Failed to connect to MQTT broker:', error.errorMessage)
        },
        keepAliveInterval: 60
      })

      console.log('Connected to broker successfully')

      client.onMessageArrived = (message) => {
        const content = message.payloadString
        chatMessages.value.push({ id: Date.now(), content })
      }
    }

    const sendMessage = () => {
      const message = inputMessage.value.trim()
      if (message && client) {
        const mqttMessage = new Message(message)
        mqttMessage.destinationName = 'chat/message'
        client.send(mqttMessage)
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
