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
import mqtt from 'mqtt'

export default {
  name: 'ChatComponent',
  setup() {
    const chatMessages = ref([] as { id: number; content: string }[])
    const inputMessage = ref('')
    let client: mqtt.MqttClient

    const connectToBroker = () => {
      const clientId = `client-${Date.now()}`

      const host = 'ws://localhost:15675/ws'

      const options: mqtt.IClientOptions = {
        keepalive: 30,
        clientId: clientId,
        protocolId: 'MQTT',
        protocolVersion: 4,
        clean: true,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
        will: {
          topic: 'WillMsg',
          payload: 'Connection Closed abnormally..!',
          qos: 0,
          retain: false
        },
        rejectUnauthorized: false
      }

      client = mqtt.connect(host, options)

      client.on('error', (err) => {
        console.log('Connection error: ', err)
        client.end()
      })

      client.on('reconnect', () => {
        console.log('Reconnecting...')
      })

      client.on('connect', () => {
        console.log('Client connected:' + clientId)
        client.subscribe('chat/message', { qos: 0 })
      })

      client.on('message', (_0, message, _1) => {
        chatMessages.value.push({ id: Date.now(), content: message.toString() })
      })

      client.on('close', () => {
        console.log(clientId + ' disconnected')
      })
    }

    const sendMessage = () => {
      const message = inputMessage.value.trim()
      console.log(client?.connected)
      if (message && client) {
        client.publish('chat/message', message)
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
