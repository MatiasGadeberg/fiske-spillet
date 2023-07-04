import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useGameStore } from './game.js'
import { MqttWrapper } from '../../../shared/classes/MqttWrapper.js'
import type { PlayerJoinInfo, PlayerLeaveInfo } from '../../../shared/types/ManagementTypes.js'
import type { GameInfo, TeamInfo } from '../../../shared/types/GameTypes.js'
import { useTeamStore } from './team.js'

export const useMqttStore = defineStore('mqtt', () => {
  const game = useGameStore()
  const team = useTeamStore()
  const clientId = `player-${Date.now()}`
  let mqtt: MqttWrapper

  const connect = () => {
    mqtt = new MqttWrapper({
      clientId,
      connectionType: 'web-mqtt',
      onConnectCallbackFunction: onConnet,
      onMessageCallbackFunction: onMessage
    })
  }

  const onConnet = (): void => {
    console.log('Client connected')
    mqtt.subscribeToTopic({
      'game-data': { qos: 0 },
      [`team-data/${team.teamId}`]: { qos: 0 }
    })
  }

  const onMessage = (topic: string, message: any): void => {
    console.log(`Recieved message on topic ${topic}:`)
    console.log(JSON.parse(message))
    switch (topic) {
      case 'game-data':
        game.updateGameData(JSON.parse(message) as GameInfo)

        break
      case `team-data/${team.teamId}`:
        team.updateTeamData(JSON.parse(message) as TeamInfo)

      default:
        break
    }
  }

  const publishPlayerJoined = (): void => {
    const joinInfo: PlayerJoinInfo = {
      clientId,
      teamId: team.teamId
    }
    mqtt.publishToTopic('player-join', JSON.stringify(joinInfo))
  }

  const publishPlayerLeft = (): void => {
    const leaveInfo: PlayerLeaveInfo = {
      clientId,
      teamId: team.teamId
    }
    mqtt.publishToTopic('player-leave', JSON.stringify(leaveInfo))
  }

  return { connect, publishPlayerJoined, publishPlayerLeft }
})
