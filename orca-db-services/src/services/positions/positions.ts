// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  positionDataValidator,
  positionPatchValidator,
  positionQueryValidator,
  positionResolver,
  positionExternalResolver,
  positionDataResolver,
  positionPatchResolver,
  positionQueryResolver
} from './positions.schema'

import type { Application } from '../../declarations'
import { PositionService, getOptions } from './positions.class'
import { positionPath, positionMethods } from './positions.shared'

export * from './positions.class'
export * from './positions.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const position = (app: Application) => {
  // Register our service on the Feathers application
  app.use(positionPath, new PositionService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: positionMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(positionPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(positionExternalResolver),
        schemaHooks.resolveResult(positionResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(positionQueryValidator),
        schemaHooks.resolveQuery(positionQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(positionDataValidator),
        schemaHooks.resolveData(positionDataResolver)
      ],
      patch: [
        schemaHooks.validateData(positionPatchValidator),
        schemaHooks.resolveData(positionPatchResolver)
      ],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [positionPath]: PositionService
  }
}
