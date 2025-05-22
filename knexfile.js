// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html

const {
  ORCA_PG_USER,
  ORCA_PG_PASSWORD,
  ORCA_PG_HOST,
  ORCA_PG_PORT,
  ORCA_PG_DATABASE,
  ORCA_PG_SSL
} = process.env

const connection = `postgres://${ORCA_PG_USER}:${ORCA_PG_PASSWORD}@${ORCA_PG_HOST}:${ORCA_PG_PORT}/${ORCA_PG_DATABASE}`

// Log connection info (password masked)
const masked = connection.replace(/:\S+@/, ':****@')
console.log('[knexfile] Using database:', masked)

const connectionConfig = {
  connectionString: connection,
}

// Only add SSL configuration if ORCA_PG_SSL is true
if (ORCA_PG_SSL === 'true') {
  connectionConfig.ssl = {
    rejectUnauthorized: false,
  }
  console.log('[knexfile] SSL is enabled')
} else {
  console.log('[knexfile] SSL is disabled')
}

export default {
  client: 'pg',
  connection: connectionConfig,
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations'
  }
} 