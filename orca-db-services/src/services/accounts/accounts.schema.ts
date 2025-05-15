// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations.js'
import { dataValidator, queryValidator } from '../../validators.js'
import type { AccountService } from './accounts.class.js'

// Main data model schema
export const accountSchema = Type.Object(
  {
    id: Type.String(),
    user_id: Type.String(),
    status: Type.Integer({ minimum: 1, maximum: 2 }), // 1:Active 2:Frozen
    original_payment: Type.Integer(), // unit $0.0001
    cost: Type.Integer(), // accumulated trade cost
    frozen_payment: Type.Integer(), // unit $0.0001
    created_at: Type.Integer(), // timestamp in milliseconds
    updated_at: Type.Integer() // timestamp in milliseconds
  },
  { $id: 'Account', additionalProperties: false }
)
export type Account = Static<typeof accountSchema>
export const accountValidator = getValidator(accountSchema, dataValidator)
export const accountResolver = resolve<Account, HookContext<AccountService>>({
  created_at: async (value) => value ? parseInt(value.toString()) : 0,
  updated_at: async (value) => value ? parseInt(value.toString()) : 0
})

export const accountExternalResolver = resolve<Account, HookContext<AccountService>>({
  created_at: async (value) => value ? parseInt(value.toString()) : 0,
  updated_at: async (value) => value ? parseInt(value.toString()) : 0
})

// Schema for creating new entries
export const accountDataSchema = Type.Object({
  id: Type.String(),
  user_id: Type.String(),
  original_payment: Type.Integer()
}, {
  $id: 'AccountData',
  additionalProperties: false
})
export type AccountData = Static<typeof accountDataSchema>
export const accountDataValidator = getValidator(accountDataSchema, dataValidator)
export const accountDataResolver = resolve<Account, HookContext<AccountService>>({
  status: async () => 1, // Default to active
  cost: async () => 0,
  frozen_payment: async () => 0
})

// Schema for updating existing entries
export const accountPatchSchema = Type.Partial(accountSchema, {
  $id: 'AccountPatch'
})
export type AccountPatch = Static<typeof accountPatchSchema>
export const accountPatchValidator = getValidator(accountPatchSchema, dataValidator)
export const accountPatchResolver = resolve<Account, HookContext<AccountService>>({
  updated_at: async () => Date.now()
})

// Schema for allowed query properties
export const accountQueryProperties = Type.Pick(accountSchema, ['id', 'user_id', 'status'])
export const accountQuerySchema = Type.Intersect(
  [
    querySyntax(accountQueryProperties),
    Type.Object({
      limit: Type.Optional(Type.Integer()),
      skip: Type.Optional(Type.Integer())
    }, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type AccountQuery = Static<typeof accountQuerySchema>
export const accountQueryValidator = getValidator(accountQuerySchema, queryValidator)
export const accountQueryResolver = resolve<AccountQuery, HookContext<AccountService>>({})
