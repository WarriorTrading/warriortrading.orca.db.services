// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html
import { createRequire } from 'module'
import type { Knex } from 'knex'
import type { Application } from './declarations.js'

declare module './declarations.js' {
  interface Configuration {
    postgresql: {
      client: string
      connection: string
    }
  }
}

const require = createRequire(import.meta.url)
const knex = require('knex')

export const postgresql = (app: Application) => {
  const config = app.get('postgresql')
  // If the connection string still contains placeholders, build it from individual fields
  if (typeof config?.connection === 'string' && config.connection.includes('${')) {
    const { user, password, host, port, database } = config as any
    config.connection = `postgres://${user}:${password}@${host}:${port}/${database}`
    // Persist the resolved connection back to the app settings
    app.set('postgresql', config)
  }
  const db = knex(config!)

  // Add SQL query logging
  db.on('query', (queryData: any) => {
    console.log('SQL Query:', {
      sql: queryData.sql,
      bindings: queryData.bindings,
      method: queryData.method,
      options: queryData.options
    })
  })

  app.set('postgresqlClient', db)
}
