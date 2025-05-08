// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Position, PositionData, PositionPatch, PositionQuery } from './positions.schema'

export type { Position, PositionData, PositionPatch, PositionQuery }

export interface PositionParams extends KnexAdapterParams<PositionQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class PositionService<ServiceParams extends Params = PositionParams> extends KnexService<
  Position,
  PositionData,
  PositionParams,
  PositionPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'positions'
  }
}
