// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html
import { createRequire } from 'module'
import type { Knex } from 'knex'
import type { Application } from './declarations.js'
import {connection} from "@feathersjs/authentication/lib/hooks/index.js";

declare module './declarations.js' {
  interface Configuration {
    profile:string
    postgresqlConfig: {
      client: string
      connection: string | {
        connectionString?: string
        host: string,
        port: number,
        user: string,
        password: string,
        database: string,
        ssl?: string | boolean | object
      }
    }
  }
}

const require = createRequire(import.meta.url)
const knex = require('knex')


export const postgresql = (app: Application) => {
  const config = app.get('postgresql')


  // Convert port to number if needed
  if (config && typeof config.connection === 'object' && config.connection !== null) {
    if ('port' in config.connection && typeof config.connection.port === 'string') {
      config.connection.port = parseInt(config.connection.port, 10)
    }
    const profile = app.get('profile')
    console.log(profile)
    if (profile === 'dev') {
       console.log(config.connection)
    }
    else {
      config.connection.ssl = { rejectUnauthorized: false }
      console.log(config.connection)
    }

  }
  // If the connection string still contains placeholders, build it from individual fields
  if (typeof config?.connection === 'string' && config.connection.includes('${')) {
    const { user, password, host, port, database } = config as any
    config.connection = `postgres://${user}:${password}@${host}:${port}/${database}`
    // Persist the resolved connection back to the app settings
    app.set('postgresql', config)
    console.log(`connecting to ${host}:${port}/${database}`)
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
