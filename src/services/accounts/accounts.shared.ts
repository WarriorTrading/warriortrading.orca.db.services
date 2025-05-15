// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client.js'
import type { Account, AccountData, AccountPatch, AccountQuery, AccountService } from './accounts.class.js'

export type { Account, AccountData, AccountPatch, AccountQuery }

export type AccountClientService = Pick<AccountService, (typeof accountMethods)[number]>

export const accountPath = 'accounts'

export const accountMethods: Array<keyof AccountService> = ['find', 'get', 'create', 'patch', 'remove']

export const accountClient = (client: ClientApplication) => {
  // Register the service on the client
  client.use(accountPath, client.service(accountPath), {
    methods: accountMethods
  })
}

// Add this service to the client service type index
declare module '../../client.js' {
  interface ServiceTypes {
    [accountPath]: AccountClientService
  }
}
