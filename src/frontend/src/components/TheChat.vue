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
import { reactive, onMounted } from 'vue'
import amqp from 'amqplib'

export default {
  name: 'ChatComponent',
  setup() {
    const chatMessages = reactive([])
    const inputMessage = reactive('')

    let connection: amqp.Connection | null = null
    let channel: amqp.Channel | null = null

    const establishConnection = async () => {
      try {
        connection = await amqp.connect('amqp://localhost') // Replace with your RabbitMQ connection URL
        channel = await connection.createChannel()

        await channel.assertExchange('chat', 'topic') // Create or ensure the 'chat' exchange exists
        const { queue } = await channel.assertQueue('', { exclusive: true }) // Create an exclusive queue
        await channel.bindQueue(queue, 'chat', 'chat.message') // Bind the queue to the exchange with the specified topic

        await channel.consume(queue, (message) => {
          const content = message.content.toString()
          chatMessages.push({ id: Date.now(), content }) // Add the received message to the chatMessages list
          channel.ack(message) // Acknowledge the message to remove it from the queue
        })
      } catch (error) {
        console.error('Error establishing connection:', error)
      }
    }

    const sendMessage = async () => {
      try {
        if (!connection) {
          await establishConnection()
        }

        await channel.assertExchange('chat', 'topic') // Create or ensure the 'chat' exchange exists

        const message = inputMessage.trim()
        if (message) {
          channel.publish('chat', 'chat.message', Buffer.from(message)) // Publish the message to the exchange with the specified topic
          inputMessage = '' // Clear the input field
        }
      } catch (error) {
        console.error('Error sending message:', error)
      }
    }

    onMounted(() => {
      establishConnection()
    })

    return {
      chatMessages,
      inputMessage,
      sendMessage
    }
  }
}
</script>
