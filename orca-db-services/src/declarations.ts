// For more information about this file see https://dove.feathersjs.com/guides/cli/typescript.html
import { HookContext as FeathersHookContext, NextFunction } from '@feathersjs/feathers'
import { Application as FeathersApplication } from '@feathersjs/koa'
import { ApplicationConfiguration } from './configuration.js'
import type { AccountService } from './services/accounts/accounts.class.js'
import type { PositionService } from './services/positions/positions.class.js'
import type { OrderService } from './services/orders/orders.class.js'
import type { Knex } from 'knex'

export type { NextFunction }

// The types for app.get(name) and app.set(name)
export interface Configuration extends ApplicationConfiguration {
  paginate: {
    default: number
    max: number
  }
  postgresql: {
    client: string
    connection: string
  }
  postgresqlClient: Knex
}

// A mapping of service names to types. Will be extended in service files.
export interface ServiceTypes {
  'accounts': AccountService
  'positions': PositionService
  'orders': OrderService
}

// The application instance type that will be used everywhere else
export type Application = FeathersApplication<ServiceTypes, Configuration>

// The context for hook functions - can be typed with a service class
export type HookContext<S = any> = FeathersHookContext<Application, S>
