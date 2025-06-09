// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html

const {
  ORCA_PG_USER,
  ORCA_PG_PASSWORD,
  ORCA_PG_HOST,
  ORCA_PG_PORT,
  ORCA_PG_DATABASE
} = process.env

const connection = `postgres://${ORCA_PG_USER}:${ORCA_PG_PASSWORD}@${ORCA_PG_HOST}:${ORCA_PG_PORT}/${ORCA_PG_DATABASE}`

// Log connection info (password masked)
const masked = connection.replace(/:\S+@/, ':****@')
console.log('[knexfile] Using database:', masked)

const profile = process.env.PROFILE || 'default'
console.log('[knexfile] Using profile:', profile)

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