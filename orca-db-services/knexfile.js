// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html

export default {
  client: 'pg',
  connection: 'postgres://postgres:rick400918@localhost:5432/orca-sim',
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations'
  }
} 