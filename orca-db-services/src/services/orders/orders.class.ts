// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Order, OrderData, OrderPatch, OrderQuery } from './orders.schema'
import type { PaginationOptions } from '@feathersjs/feathers'
import type { Paginated } from '@feathersjs/feathers'

export type { Order, OrderData, OrderPatch, OrderQuery }

export interface OrderParams extends KnexAdapterParams<OrderQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class OrderService<ServiceParams extends Params = OrderParams> extends KnexService<
  Order,
  OrderData,
  OrderParams,
  OrderPatch
> {
  find(params?: OrderParams & { paginate?: PaginationOptions }): Promise<Paginated<Order>>;
  find(params?: OrderParams): Promise<Order[]>;
  find(params?: OrderParams): Promise<Paginated<Order> | Order[]> {
    const query = params?.query || {}
    const { startTime, endTime, ...restQuery } = query

    // Build the query with timestamp range if provided
    const finalQuery = {
      ...restQuery,
      $sort: {
        created_at: -1
      }
    }

    // Add timestamp range conditions only when values are greater than 0
    if ((typeof startTime === 'number' && startTime > 0) || (typeof endTime === 'number' && endTime > 0)) {
      finalQuery.created_at = {
        ...(typeof startTime === 'number' && startTime > 0 && { $gte: startTime }),
        ...(typeof endTime === 'number' && endTime > 0 && { $lte: endTime })
      }
    }

    return super.find({
      ...params,
      query: finalQuery
    })
  }
}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'orca_sim_order'
  }
}
