// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations.js'
import type { Order, OrderData, OrderPatch, OrderQuery } from './orders.schema.js'
import type { PaginationOptions } from '@feathersjs/feathers'
import type { Paginated } from '@feathersjs/feathers'

export type { Order, OrderData, OrderPatch, OrderQuery }

export interface OrderParams extends KnexAdapterParams<OrderQuery> {
  query?: OrderQuery & {
    $sort?: { [key: string]: number }
    $limit?: number
    $skip?: number
    $select?: string[]
    skip?: number
    $and?: Array<{ [key: string]: any }>
    startTime?: number
    endTime?: number
    status?: number | string | number[]
  }
}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class OrderService extends KnexService<
  Order,
  OrderData,
  OrderParams,
  OrderPatch
> {
  async find(params?: OrderParams & { paginate?: PaginationOptions }): Promise<Paginated<Order>>;
  async find(params?: OrderParams & { paginate: false }): Promise<Order[]>;
  async find(params?: OrderParams): Promise<Paginated<Order> | Order[]> {
    const query = params?.query || {}
    const { startTime, endTime, status, ...restQuery } = query

    // Build the query with timestamp range if provided
    const finalQuery: any = {
      ...restQuery,
      $sort: {
        created_at: -1
      }
    }

    // Handle multiple status values
    if (status !== undefined) {
      if (typeof status === 'string' && status.includes(',')) {
        // Parse comma-separated status values
        const statusArray = status.split(',')
          .map(s => parseInt(s.trim(), 10))
          .filter(s => !isNaN(s) && s >= 1 && s <= 6) // Validate status range
        
        if (statusArray.length > 0) {
          finalQuery.status = { $in: statusArray }
        }
      } else if (Array.isArray(status)) {
        // Handle array of status values
        const statusArray = status
          .map(s => typeof s === 'string' ? parseInt(s, 10) : s)
          .filter(s => !isNaN(s) && s >= 1 && s <= 6) // Validate status range
        
        if (statusArray.length > 0) {
          finalQuery.status = { $in: statusArray }
        }
      } else if (typeof status === 'number' && status >= 1 && status <= 6) {
        // Handle single status value
        finalQuery.status = status
      } else if (typeof status === 'string') {
        // Handle single status value as string
        const statusNum = parseInt(status, 10)
        if (!isNaN(statusNum) && statusNum >= 1 && statusNum <= 6) {
          finalQuery.status = statusNum
        }
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
    } as OrderParams)
  }
}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'orca_sim_order'
  }
}
