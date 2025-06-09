import { position } from './positions/positions.js'
import { order } from './orders/orders.js'
import { account } from './accounts/accounts.js'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations.js'

export const services = (app: Application) => {
  app.configure(position)
  app.configure(order)
  app.configure(account)
  // All services will be registered here
}
