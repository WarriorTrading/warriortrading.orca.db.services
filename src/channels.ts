// For more information about this file see https://dove.feathersjs.com/guides/cli/channels.html
import type { Application } from './declarations.js'
import { logger } from './logger.js'

export const channels = (app: Application) => {
  logger.info('Channels configured for REST-only mode. Real-time features disabled.')
  
  // No real-time channels configuration needed for REST-only mode
  // All functionality is handled through REST API endpoints
}
