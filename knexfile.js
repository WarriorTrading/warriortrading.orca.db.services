// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html

const {
  DATABASE_URL,
  ORCA_PG_USER = 'warrior',
  ORCA_PG_PASSWORD = 'W-x3biMc9cZF',
  ORCA_PG_HOST = 'localhost',
  ORCA_PG_PORT = '5432',
  ORCA_PG_DATABASE = 'orca_sim'
} = process.env

export default {
  client: 'pg',
  connection:
    DATABASE_URL ||
    `postgres://${ORCA_PG_USER}:${ORCA_PG_PASSWORD}@${ORCA_PG_HOST}:${ORCA_PG_PORT}/${ORCA_PG_DATABASE}`,
  // Log connection info (password masked) when knexfile is loaded
  // eslint-disable-next-line no-console
  ...(function () {
    const full = DATABASE_URL || `postgres://${ORCA_PG_USER}:${ORCA_PG_PASSWORD}@${ORCA_PG_HOST}:${ORCA_PG_PORT}/${ORCA_PG_DATABASE}`
    const masked = full.replace(/:\S+@/, ':****@')
    console.log('[knexfile] Using database:', masked)
    return {}
  })(),
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations'
  }
} 