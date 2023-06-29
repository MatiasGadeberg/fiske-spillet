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
    let client: mqtt.MqttClient | null = null

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

      console.log('connecting mqtt client')
      const client = mqtt.connect(host, options)

      client.on('error', (err) => {
        console.log('Connection error: ', err)
        client.end()
      })

      client.on('reconnect', () => {
        console.log('Reconnecting...')
      })

      client.on('connect', () => {
        console.log('Client connected:' + clientId)
        client.subscribe('testtopic', { qos: 0 })
        client.publish('testtopic', 'ws connection demo...!', { qos: 0, retain: false })
      })

      client.on('message', (topic, message, packet) => {
        console.log('Received Message: ' + message.toString() + '\nOn topic: ' + topic)
      })

      client.on('close', () => {
        console.log(clientId + ' disconnected')
      })

      //   const brokerUrl = 'ws://localhost:15675/ws' // Replace with your RabbitMQ MQTT WebSocket URL
      //   const clientId = `client-${Date.now()}`
      //   const options = {
      //     keepalive: 60,
      //     clientId,
      //     protocolId: 'MQTT',
      //     protocolVersion: 4,
      //     clean: true,
      //     reconnectPeriod: 1000,
      //     connectTimeout: 30 * 1000
      //   }

      //   client = mqtt.connect(brokerUrl, options)

      //   client.on('connect', () => {
      //     console.log('Connected to mqtt broker')
      //   })

      //   client.on('message', (topic, payload) => {
      //     const content = payload.toString()
      //     chatMessages.value.push({ id: Date.now(), content })
      //   })
    }

    const sendMessage = () => {
      const message = inputMessage.value.trim()
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
