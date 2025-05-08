// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Position, PositionData, PositionPatch, PositionQuery, PositionService } from './positions.class'

export type { Position, PositionData, PositionPatch, PositionQuery }

export type PositionClientService = Pick<
  PositionService<Params<PositionQuery>>,
  (typeof positionMethods)[number]
>

export const positionPath = 'positions'

export const positionMethods: Array<keyof PositionService> = ['find', 'get', 'create', 'patch', 'remove']

export const positionClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(positionPath, connection.service(positionPath), {
    methods: positionMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [positionPath]: PositionClientService
  }
}
