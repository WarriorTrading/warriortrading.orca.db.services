// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html
import { readFileSync } from 'fs'
import { resolve as resolvePath } from 'path'

const profile = process.env.PROFILE || 'default'
console.log('[knexfile] Using profile:', profile)

// Read configuration from config files
let defaultConfig = {}
let envConfig = {}

// Always try to load default.json as base configuration
try {
  const defaultConfigPath = resolvePath('./config/default.json')
  defaultConfig = JSON.parse(readFileSync(defaultConfigPath, 'utf8'))
  console.log('[knexfile] Loaded default.json')
} catch (error) {
  console.warn('[knexfile] Could not read default.json, using fallback values')
}

// Try to load environment-specific config file (if not default profile)
if (profile !== 'default') {
  try {
    const envConfigPath = resolvePath(`./config/${profile}.json`)
    envConfig = JSON.parse(readFileSync(envConfigPath, 'utf8'))
    console.log(`[knexfile] Loaded ${profile}.json`)
  } catch (error) {
    console.log(`[knexfile] No ${profile}.json found, using default config only`)
  }
}

// Merge configurations (environment-specific overrides default)
const mergedConfig = {
  ...defaultConfig,
  ...envConfig,
  postgresqlConfig: {
    ...defaultConfig.postgresqlConfig,
    ...envConfig.postgresqlConfig,
    connection: {
      ...defaultConfig.postgresqlConfig?.connection,
      ...envConfig.postgresqlConfig?.connection
    }
  }
}

// Use environment variables if provided, otherwise fall back to config file, then hard-coded defaults
const pgConfig = mergedConfig.postgresqlConfig?.connection || {}
const host = process.env.ORCA_PG_HOST || pgConfig.host || 'localhost'
const port = process.env.ORCA_PG_PORT || pgConfig.port || '5432'
const user = process.env.ORCA_PG_USER || pgConfig.user || 'warrior'
const password = process.env.ORCA_PG_PASSWORD || pgConfig.password || 'defaultpassword'
const database = process.env.ORCA_PG_DATABASE || pgConfig.database || 'orca_sim'

const connection = `postgres://${user}:${password}@${host}:${port}/${database}`

// Log connection info (password masked)
const masked = connection.replace(/:\S+@/, ':****@')
console.log('[knexfile] Using database:', masked)

let connectionConfig
if (profile == "default") {
  connectionConfig = {
    connectionString: connection,
  }
} else {
  connectionConfig = {
    connectionString: connection,
    ssl: {
      rejectUnauthorized: false,
    },
  }
}

export default {
  client: 'pg',
  connection: connectionConfig,
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations'
  }
} 