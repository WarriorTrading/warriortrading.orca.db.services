// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations.js'
import { Account, AccountData, AccountPatch, AccountQuery } from './accounts.schema.js'

export type { Account, AccountData, AccountPatch, AccountQuery }

export interface AccountParams extends KnexAdapterParams<AccountQuery> {
  query?: AccountQuery & {
    $sort?: { [key: string]: number }
    $limit?: number
    $skip?: number
    $select?: string[]
    $and?: Array<Partial<AccountQuery>>
    skip?: number
  }
}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class AccountService<ServiceParams extends AccountParams = AccountParams> extends KnexService<
  Account,
  AccountData,
  ServiceParams,
  AccountPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'accounts'
  }
}
