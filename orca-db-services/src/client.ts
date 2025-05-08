// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from '@feathersjs/feathers'
import type { TransportConnection, Application } from '@feathersjs/feathers'
import authenticationClient from '@feathersjs/authentication-client'
import type { AuthenticationClientOptions } from '@feathersjs/authentication-client'

import { positionClient } from './services/positions/positions.shared'
export type {
  Position,
  PositionData,
  PositionQuery,
  PositionPatch
} from './services/positions/positions.shared'

import { orderClient } from './services/orders/orders.shared'
export type { Order, OrderData, OrderQuery, OrderPatch } from './services/orders/orders.shared'

import { accountClient } from './services/accounts/accounts.shared'
export type { Account, AccountData, AccountQuery, AccountPatch } from './services/accounts/accounts.shared'

export interface Configuration {
  connection: TransportConnection<ServiceTypes>
}

export interface ServiceTypes {}

export type ClientApplication = Application<ServiceTypes, Configuration>

/**
 * Returns a typed client for the orca-db-services app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export const createClient = <Configuration = any,>(
  connection: TransportConnection<ServiceTypes>,
  authenticationOptions: Partial<AuthenticationClientOptions> = {}
) => {
  const client: ClientApplication = feathers()

  client.configure(connection)
  client.configure(authenticationClient(authenticationOptions))
  client.set('connection', connection)

  client.configure(accountClient)
  client.configure(orderClient)
  client.configure(positionClient)
  return client
}
