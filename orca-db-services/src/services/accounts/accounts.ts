// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  accountDataValidator,
  accountPatchValidator,
  accountQueryValidator,
  accountResolver,
  accountExternalResolver,
  accountDataResolver,
  accountPatchResolver,
  accountQueryResolver
} from './accounts.schema.js'

import type { Application } from '../../declarations.js'
import { AccountService, getOptions } from './accounts.class.js'
import { accountPath, accountMethods } from './accounts.shared.js'

export * from './accounts.class.js'
export * from './accounts.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const account = (app: Application) => {
  // Register our service on the Feathers application
  app.use(accountPath, new AccountService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: accountMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(accountPath).hooks({
    around: {
      all: [],
      find: []
    },
    before: {
      all: [
        schemaHooks.validateQuery(accountQueryValidator),
        schemaHooks.resolveQuery(accountQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(accountDataValidator),
        schemaHooks.resolveData(accountDataResolver)
      ],
      patch: [
        schemaHooks.validateData(accountPatchValidator),
        schemaHooks.resolveData(accountPatchResolver)
      ],
      remove: []
    },
    after: {
      all: [],
      find: [
        async (context) => {
          try {
            const result = context.result as any
            if (!result) {
              context.result = {
                responseCode: "200",
                responseMsg: "success",
                total: 0,
                limit: 10,
                skip: 0,
                data: []
              } as any
            } else {
              // Extract pagination data
              const { total, limit, skip, data } = result
              
              // Format each account in the data array
              const formattedData = data.map((account: any) => {
                const { created_at, updated_at, ...accountData } = account
                return {
                  ...accountData,
                  created_at: created_at?.toString() || "0",
                  updated_at: updated_at?.toString() || "0"
                }
              })
              
              // Set the response with the correct format
              context.result = {
                responseCode: "200",
                responseMsg: "success",
                total: total || 0,
                limit: limit || 10,
                skip: skip || 0,
                data: formattedData
              } as any
            }
          } catch (error) {
            context.result = {
              responseCode: "500",
              responseMsg: "Internal server error",
              total: 0,
              limit: 10,
              skip: 0,
              data: []
            } as any
          }
          return context
        }
      ],
      get: [
        async (context) => {
          try {
            const result = context.result as any
            if (!result || typeof result !== 'object') {
              context.result = {
                responseCode: "200",
                responseMsg: "success",
                data: null
              } as any
            } else {
              // Extract timestamp fields and other data
              const { created_at, updated_at, ...accountData } = result
              
              // Create the response with timestamps only in data object
              const responseData = {
                ...accountData,
                created_at: created_at?.toString() || "0",
                updated_at: updated_at?.toString() || "0"
              }
              
              // Set the response with the correct format
              const response = {
                responseCode: "200",
                responseMsg: "success",
                data: responseData
              }
              
              // Ensure no timestamp fields at root level
              context.result = response as any
            }
          } catch (error) {
            context.result = {
              responseCode: "500",
              responseMsg: "Internal server error",
              data: null
            } as any
          }
          return context
        }
      ],
      create: [
        async (context) => {
          try {
            const result = context.result as any
            if (!result || typeof result !== 'object') {
              context.result = {
                responseCode: "500",
                responseMsg: "Internal server error",
                data: null
              } as any
            } else {
              // Extract timestamp fields and other data
              const { created_at, updated_at, ...accountData } = result
              
              // Create the response with timestamps only in data object
              const responseData = {
                ...accountData,
                created_at: created_at?.toString() || "0",
                updated_at: updated_at?.toString() || "0"
              }
              
              // Set the response with the correct format
              context.result = {
                responseCode: "200",
                responseMsg: "success",
                data: responseData
              } as any
            }
          } catch (error) {
            context.result = {
              responseCode: "500",
              responseMsg: "Internal server error",
              data: null
            } as any
          }
          return context
        }
      ],
      patch: [
        async (context) => {
          try {
            const result = context.result as any
            if (!result || typeof result !== 'object') {
              context.result = {
                responseCode: "500",
                responseMsg: "Internal server error",
                data: null
              } as any
            } else {
              // Extract timestamp fields and other data
              const { created_at, updated_at, ...accountData } = result
              
              // Create the response with timestamps only in data object
              const responseData = {
                ...accountData,
                created_at: created_at?.toString() || "0",
                updated_at: updated_at?.toString() || "0"
              }
              
              // Set the response with the correct format
              context.result = {
                responseCode: "200",
                responseMsg: "success",
                data: responseData
              } as any
            }
          } catch (error) {
            context.result = {
              responseCode: "500",
              responseMsg: "Internal server error",
              data: null
            } as any
          }
          return context
        }
      ]
    },
    error: {
      all: [
        async (context) => {
          // Wrap all errors in the standard response format
          context.result = {
            responseCode: context.error?.code?.toString() || "500",
            responseMsg: context.error?.message || "Internal server error",
            data: null
          } as any
          return context
        }
      ]
    }
  })
}

// Add this service to the service type index
declare module '../../declarations.js' {
  interface ServiceTypes {
    [accountPath]: AccountService
  }
}
