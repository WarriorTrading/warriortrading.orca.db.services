// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import type { Application } from '@feathersjs/feathers'
import { feathers } from '@feathersjs/feathers'
import { io } from 'socket.io-client'
import type { SocketService } from '@feathersjs/socketio-client'
import { positionClient } from './services/positions/positions.shared.js'
import type {
  Position,
  PositionData,
  PositionQuery,
  PositionPatch
} from './services/positions/positions.shared.js'
import { orderClient } from './services/orders/orders.shared.js'
import type { Order, OrderData, OrderQuery, OrderPatch } from './services/orders/orders.shared.js'
import { accountClient } from './services/accounts/accounts.shared.js'
import type { Account, AccountData, AccountQuery, AccountPatch } from './services/accounts/accounts.shared.js'

// Import client modules
import socketio from '@feathersjs/socketio-client'
import rest from '@feathersjs/rest-client'
import auth from '@feathersjs/authentication-client'

export type { Position, PositionData, PositionQuery, PositionPatch }
export type { Order, OrderData, OrderQuery, OrderPatch }
export type { Account, AccountData, AccountQuery, AccountPatch }

export interface Configuration {
  host: string
  port: number
  public: string
  origins: string[]
  paginate: {
    default: number
    max: number
  }
  authentication: {
    secret: string
    authStrategies: string[]
    oauth: {
      redirect: string
      origins: string[]
    }
  }
}

export interface ServiceTypes {}

export type ClientApplication = Application<ServiceTypes, Configuration>

export const createClient = (config: Configuration) => {
  const socket = io(config.host, {
    transports: ['websocket'],
    forceNew: true,
    reconnection: true,
    timeout: 10000
  })

  const client = feathers<ServiceTypes, Configuration>()

  // Set up Socket.io client with the socket
  const socketioClient = socketio as any
  client.configure(socketioClient(socket))

  // Set up REST client
  const restClient = rest as any
  const restService = restClient(config.host)
  client.configure(restService.fetch(window.fetch.bind(window)))

  // Set up authentication client
  const authClient = auth as any
  client.configure(authClient({
    storage: window.localStorage
  }))

  // Register service clients
  client.configure(positionClient)
  client.configure(orderClient)
  client.configure(accountClient)

  return client
}
