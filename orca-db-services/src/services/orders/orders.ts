// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  orderDataValidator,
  orderPatchValidator,
  orderQueryValidator,
  orderResolver,
  orderExternalResolver,
  orderDataResolver,
  orderPatchResolver,
  orderQueryResolver
} from './orders.schema.js'

import type { Application } from '../../declarations.js'
import { OrderService, getOptions } from './orders.class.js'
import { orderPath, orderMethods } from './orders.shared.js'

export * from './orders.class.js'
export * from './orders.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const order = (app: Application) => {
  // Register our service on the Feathers application
  app.use(orderPath, new OrderService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: orderMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(orderPath).hooks({
    around: {
      all: [],
      find: []
    },
    before: {
      all: [
        schemaHooks.validateQuery(orderQueryValidator),
        schemaHooks.resolveQuery(orderQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(orderDataValidator),
        schemaHooks.resolveData(orderDataResolver)
      ],
      patch: [
        schemaHooks.validateData(orderPatchValidator),
        schemaHooks.resolveData(orderPatchResolver)
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
              
              // Format each order in the data array
              const formattedData = data.map((order: any) => {
                const { created_at, updated_at, ...orderData } = order
                return {
                  ...orderData,
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
              const { created_at, updated_at, ...orderData } = result
              
              // Create the response with timestamps only in data object
              const responseData = {
                ...orderData,
                created_at: parseInt(created_at?.toString() || '0'),
                updated_at: parseInt(updated_at?.toString() || '0')
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
              const { created_at, updated_at, ...orderData } = result
              
              // Create the response with timestamps only in data object
              const responseData = {
                ...orderData,
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
              const { created_at, updated_at, ...orderData } = result
              
              // Create the response with timestamps only in data object
              const responseData = {
                ...orderData,
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
    [orderPath]: OrderService
  }
}
