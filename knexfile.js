// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html

export default {
  client: 'pg',
  connection: 'postgres://warrior:W-x3biMc9cZF@localhost:5432/orca_sim',
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations'
  }
} 