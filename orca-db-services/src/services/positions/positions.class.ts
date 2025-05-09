// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations.js'
import type { Position, PositionData, PositionPatch, PositionQuery } from './positions.schema.js'
import type { PaginationOptions } from '@feathersjs/feathers'
import type { Paginated } from '@feathersjs/feathers'

export type { Position, PositionData, PositionPatch, PositionQuery }

export interface PositionParams extends KnexAdapterParams<PositionQuery> {
  query?: PositionQuery & {
    $sort?: { [key: string]: number }
    $limit?: number
    $skip?: number
    $select?: string[]
    skip?: number
    $and?: Array<{ [key: string]: any }>
  }
}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class PositionService extends KnexService<
  Position,
  PositionData,
  PositionParams,
  PositionPatch
> {
  async find(params?: PositionParams & { paginate?: PaginationOptions }): Promise<Paginated<Position>>;
  async find(params?: PositionParams & { paginate: false }): Promise<Position[]>;
  async find(params?: PositionParams): Promise<Paginated<Position> | Position[]> {
    const query = params?.query || {}
    return super.find({
      ...params,
      query: {
        ...query,
        $sort: {
          created_at: -1
        }
      }
    } as PositionParams)
  }
}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'positions'
  }
}
