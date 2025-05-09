// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client.js'
import type { Order, OrderData, OrderPatch, OrderQuery, OrderService } from './orders.class.js'

export type { Order, OrderData, OrderPatch, OrderQuery }

export type OrderClientService = Pick<OrderService, (typeof orderMethods)[number]>

export const orderPath = 'orders'

export const orderMethods: Array<keyof OrderService> = ['find', 'get', 'create', 'patch', 'remove']

export const orderClient = (client: ClientApplication) => {
  // Register the service on the client
  client.use(orderPath, client.service(orderPath), {
    methods: orderMethods
  })
}

// Add this service to the client service type index
declare module '../../client.js' {
  interface ServiceTypes {
    [orderPath]: OrderClientService
  }
}
