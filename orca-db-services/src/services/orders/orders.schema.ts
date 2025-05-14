// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations.js'
import { dataValidator, queryValidator } from '../../validators.js'
import type { OrderService } from './orders.class.js'

// Main data model schema
export const orderSchema = Type.Object(
  {
    id: Type.String(),
    user_id: Type.String(),
    account_id: Type.String(),
    symbol: Type.String(),
    exchange_code: Type.String(),
    side: Type.Integer({ minimum: 1, maximum: 3 }), // 1:buy 2:sell 3:sell short
    order_type: Type.Integer({ minimum: 1, maximum: 2 }), // 1:market order 2:limit order
    trade_type: Type.Integer({ minimum: 1, maximum: 3 }), // 1:day 2:gtc 3:ioc
    status: Type.Integer({ minimum: 1, maximum: 6 }), // 1:NEW 2:VALIDATED 3:FILLED 4:REJECTED 5:EXPIRED 6:CANCELLED
    is_cancelling: Type.Boolean(),
    price: Type.Integer(), // unit $0.0001
    avg_exec_price: Type.Integer(), // unit $0.0001
    qty: Type.Integer(),
    filled_qty: Type.Integer(),
    cost: Type.Integer(), // buy: avg price * qty; sell: - avg price * qty
    frozen_payment: Type.Integer(), // unit $0.0001
    frozen_qty: Type.Integer(),
    rejection_reason: Type.Optional(Type.String()),
    created_at: Type.Integer(), // timestamp in milliseconds
    updated_at: Type.Integer() // timestamp in milliseconds
  },
  { $id: 'Order', additionalProperties: false }
)
export type Order = Static<typeof orderSchema>
export const orderValidator = getValidator(orderSchema, dataValidator)
export const orderResolver = resolve<Order, HookContext<OrderService>>({})

export const orderExternalResolver = resolve<Order, HookContext<OrderService>>({})

// Schema for creating new entries
export const orderDataSchema = Type.Object({
  id: Type.String(),
  user_id: Type.String(),
  account_id: Type.String(),
  symbol: Type.String(),
  exchange_code: Type.String(),
  side: Type.Integer({ minimum: 1, maximum: 3 }), // 1:buy 2:sell 3:sell short
  order_type: Type.Integer({ minimum: 1, maximum: 2 }), // 1:market order 2:limit order
  trade_type: Type.Integer({ minimum: 1, maximum: 3 }), // 1:day 2:gtc 3:ioc
  price: Type.Integer(), // unit $0.0001
  qty: Type.Integer()
}, {
  $id: 'OrderData',
  additionalProperties: false
})
export type OrderData = Static<typeof orderDataSchema>
export const orderDataValidator = getValidator(orderDataSchema, dataValidator)
export const orderDataResolver = resolve<Order, HookContext<OrderService>>({
  status: async () => 1, // Default to NEW
  is_cancelling: async () => false,
  avg_exec_price: async () => 0,
  filled_qty: async () => 0,
  cost: async () => 0,
  frozen_payment: async () => 0,
  frozen_qty: async () => 0
})

// Schema for updating existing entries
export const orderPatchSchema = Type.Partial(orderSchema, {
  $id: 'OrderPatch'
})
export type OrderPatch = Static<typeof orderPatchSchema>
export const orderPatchValidator = getValidator(orderPatchSchema, dataValidator)
export const orderPatchResolver = resolve<Order, HookContext<OrderService>>({
  updated_at: async () => Date.now()
})

// Schema for allowed query properties
export const orderQueryProperties = Type.Pick(orderSchema, [
  'id', 'account_id', 'status', 'symbol', 'side', 'created_at'
])
export const orderQuerySchema = Type.Intersect(
  [
    querySyntax(orderQueryProperties),
    Type.Object({
      startTime: Type.Optional(Type.Integer()),
      endTime: Type.Optional(Type.Integer()),
      limit: Type.Optional(Type.Integer()),
      skip: Type.Optional(Type.Integer())
    }, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type OrderQuery = Static<typeof orderQuerySchema>
export const orderQueryValidator = getValidator(orderQuerySchema, queryValidator)
export const orderQueryResolver = resolve<OrderQuery, HookContext<OrderService>>({})
