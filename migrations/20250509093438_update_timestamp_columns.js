'use strict'

export const up = async function (knex) {
  // Update accounts table
  await knex.schema.alterTable('orca_sim_account', (table) => {
    // Add temporary columns
    table.bigInteger('created_at_new').defaultTo(knex.raw('EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000'))
    table.bigInteger('updated_at_new').defaultTo(knex.raw('EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000'))
  })
  // Convert data
  await knex.raw('UPDATE orca_sim_account SET created_at_new = EXTRACT(EPOCH FROM created_at::timestamp) * 1000')
  await knex.raw('UPDATE orca_sim_account SET updated_at_new = EXTRACT(EPOCH FROM updated_at::timestamp) * 1000')
  // Drop old columns and rename new ones
  await knex.schema.alterTable('orca_sim_account', (table) => {
    table.dropColumn('created_at')
    table.dropColumn('updated_at')
  })
  await knex.schema.alterTable('orca_sim_account', (table) => {
    table.renameColumn('created_at_new', 'created_at')
    table.renameColumn('updated_at_new', 'updated_at')
  })

  // Update orca_sim_order table
  await knex.schema.alterTable('orca_sim_order', (table) => {
    // Add temporary columns
    table.bigInteger('created_at_new').defaultTo(knex.raw('EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000'))
    table.bigInteger('updated_at_new').defaultTo(knex.raw('EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000'))
  })
  // Convert data
  await knex.raw('UPDATE orca_sim_order SET created_at_new = EXTRACT(EPOCH FROM created_at::timestamp) * 1000')
  await knex.raw('UPDATE orca_sim_order SET updated_at_new = EXTRACT(EPOCH FROM updated_at::timestamp) * 1000')
  // Drop old columns and rename new ones
  await knex.schema.alterTable('orca_sim_order', (table) => {
    table.dropColumn('created_at')
    table.dropColumn('updated_at')
  })
  await knex.schema.alterTable('orca_sim_order', (table) => {
    table.renameColumn('created_at_new', 'created_at')
    table.renameColumn('updated_at_new', 'updated_at')
  })

  // Update orca_sim_position table
  await knex.schema.alterTable('orca_sim_position', (table) => {
    // Add temporary columns
    table.bigInteger('created_at_new').defaultTo(knex.raw('EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000'))
    table.bigInteger('updated_at_new').defaultTo(knex.raw('EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000'))
    table.bigInteger('closed_at_new').defaultTo(knex.raw('EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000'))
  })
  // Convert data
  await knex.raw('UPDATE orca_sim_position SET created_at_new = EXTRACT(EPOCH FROM created_at::timestamp) * 1000')
  await knex.raw('UPDATE orca_sim_position SET updated_at_new = EXTRACT(EPOCH FROM updated_at::timestamp) * 1000')
  await knex.raw('UPDATE orca_sim_position SET closed_at_new = EXTRACT(EPOCH FROM closed_at::timestamp) * 1000')
  // Drop old columns and rename new ones
  await knex.schema.alterTable('orca_sim_position', (table) => {
    table.dropColumn('created_at')
    table.dropColumn('updated_at')
    table.dropColumn('closed_at')
  })
  await knex.schema.alterTable('orca_sim_position', (table) => {
    table.renameColumn('created_at_new', 'created_at')
    table.renameColumn('updated_at_new', 'updated_at')
    table.renameColumn('closed_at_new', 'closed_at')
  })
}

export const down = async function (knex) {
  // Revert orca_sim_account table
  await knex.schema.alterTable('orca_sim_account', (table) => {
    // Add temporary columns
    table.timestamp('created_at_old')
    table.timestamp('updated_at_old')
  })
  // Convert data back
  await knex.raw('UPDATE orca_sim_account SET created_at_old = to_timestamp(created_at / 1000.0)')
  await knex.raw('UPDATE orca_sim_account SET updated_at_old = to_timestamp(updated_at / 1000.0)')
  // Drop new columns and rename old ones back
  await knex.schema.alterTable('orca_sim_account', (table) => {
    table.dropColumn('created_at')
    table.dropColumn('updated_at')
  })
  await knex.schema.alterTable('orca_sim_account', (table) => {
    table.renameColumn('created_at_old', 'created_at')
    table.renameColumn('updated_at_old', 'updated_at')
  })

  // Revert orca_sim_order table
  await knex.schema.alterTable('orca_sim_order', (table) => {
    // Add temporary columns
    table.timestamp('created_at_old')
    table.timestamp('updated_at_old')
  })
  // Convert data back
  await knex.raw('UPDATE orca_sim_order SET created_at_old = to_timestamp(created_at / 1000.0)')
  await knex.raw('UPDATE orca_sim_order SET updated_at_old = to_timestamp(updated_at / 1000.0)')
  // Drop new columns and rename old ones back
  await knex.schema.alterTable('orca_sim_order', (table) => {
    table.dropColumn('created_at')
    table.dropColumn('updated_at')
  })
  await knex.schema.alterTable('orca_sim_order', (table) => {
    table.renameColumn('created_at_old', 'created_at')
    table.renameColumn('updated_at_old', 'updated_at')
  })

  // Revert orca_sim_position table
  await knex.schema.alterTable('orca_sim_position', (table) => {
    // Add temporary columns
    table.timestamp('created_at_old')
    table.timestamp('updated_at_old')
    table.timestamp('closed_at_old')
  })
  // Convert data back
  await knex.raw('UPDATE orca_sim_position SET created_at_old = to_timestamp(created_at / 1000.0)')
  await knex.raw('UPDATE orca_sim_position SET updated_at_old = to_timestamp(updated_at / 1000.0)')
  await knex.raw('UPDATE orca_sim_position SET closed_at_old = to_timestamp(closed_at / 1000.0)')
  // Drop new columns and rename old ones back
  await knex.schema.alterTable('orca_sim_position', (table) => {
    table.dropColumn('created_at')
    table.dropColumn('updated_at')
    table.dropColumn('closed_at')
  })
  await knex.schema.alterTable('orca_sim_position', (table) => {
    table.renameColumn('created_at_old', 'created_at')
    table.renameColumn('updated_at_old', 'updated_at')
    table.renameColumn('closed_at_old', 'closed_at')
  })
}
