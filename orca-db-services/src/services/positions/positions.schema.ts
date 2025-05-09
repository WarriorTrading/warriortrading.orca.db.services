// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { PositionService } from './positions.class'

// Main data model schema
export const positionSchema = Type.Object(
  {
    id: Type.String(),
    user_id: Type.String(),
    account_id: Type.String(),
    symbol: Type.String(),
    position_type: Type.Integer({ minimum: 1, maximum: 2 }), // 1:Long Position 2:Short Position
    avg_price: Type.Integer(), // unit $0.0001
    qty: Type.Integer(),
    total_qty: Type.Integer(), // accumulative trade orders' qty today
    realized_pl: Type.Number(), // realized Profit & Loss amount
    frozen_qty: Type.Integer(),
    executions: Type.String(), // execution list string
    created_at: Type.Integer(), // timestamp in milliseconds
    updated_at: Type.Integer(), // timestamp in milliseconds
    closed_at: Type.Integer() // timestamp in milliseconds, 0 means opened
  },
  { $id: 'Position', additionalProperties: false }
)
export type Position = Static<typeof positionSchema>
export const positionValidator = getValidator(positionSchema, dataValidator)
export const positionResolver = resolve<Position, HookContext<PositionService>>({})

export const positionExternalResolver = resolve<Position, HookContext<PositionService>>({})

// Schema for creating new entries
export const positionDataSchema = Type.Pick(positionSchema, [
  'id', 'user_id', 'account_id', 'symbol', 'position_type', 
  'avg_price', 'qty', 'executions'
], {
  $id: 'PositionData'
})
export type PositionData = Static<typeof positionDataSchema>
export const positionDataValidator = getValidator(positionDataSchema, dataValidator)
export const positionDataResolver = resolve<Position, HookContext<PositionService>>({
  total_qty: async () => 0,
  frozen_qty: async () => 0,
  realized_pl: async () => 0
})

// Schema for updating existing entries
export const positionPatchSchema = Type.Partial(positionSchema, {
  $id: 'PositionPatch'
})
export type PositionPatch = Static<typeof positionPatchSchema>
export const positionPatchValidator = getValidator(positionPatchSchema, dataValidator)
export const positionPatchResolver = resolve<Position, HookContext<PositionService>>({
  updated_at: async () => Date.now()
})

// Schema for allowed query properties
export const positionQueryProperties = Type.Pick(positionSchema, ['id', 'account_id', 'symbol', 'created_at'])
export const positionQuerySchema = Type.Intersect(
  [
    querySyntax(positionQueryProperties),
    Type.Object({
      limit: Type.Optional(Type.Integer()),
      skip: Type.Optional(Type.Integer())
    }, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type PositionQuery = Static<typeof positionQuerySchema>
export const positionQueryValidator = getValidator(positionQuerySchema, queryValidator)
export const positionQueryResolver = resolve<PositionQuery, HookContext<PositionService>>({})
