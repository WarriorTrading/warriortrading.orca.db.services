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
      all: [schemaHooks.resolveExternal(accountExternalResolver), schemaHooks.resolveResult(accountResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(accountQueryValidator), schemaHooks.resolveQuery(accountQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(accountDataValidator), schemaHooks.resolveData(accountDataResolver)],
      patch: [schemaHooks.validateData(accountPatchValidator), schemaHooks.resolveData(accountPatchResolver)],
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
declare module '../../declarations.js' {
  interface ServiceTypes {
    [accountPath]: AccountService
  }
}
