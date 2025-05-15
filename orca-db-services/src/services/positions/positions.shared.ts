// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client.js'
import type { Position, PositionData, PositionPatch, PositionQuery, PositionService } from './positions.class.js'

export type { Position, PositionData, PositionPatch, PositionQuery }

export type PositionClientService = Pick<PositionService, (typeof positionMethods)[number]>

export const positionPath = 'positions'

export const positionMethods: Array<keyof PositionService> = ['find', 'get', 'create', 'patch', 'remove']

export const positionClient = (client: ClientApplication) => {
  // Register the service on the client
  client.use(positionPath, client.service(positionPath), {
    methods: positionMethods
  })
}

// Add this service to the client service type index
declare module '../../client.js' {
  interface ServiceTypes {
    [positionPath]: PositionClientService
  }
}
