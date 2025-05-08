// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('orca_sim_position', table => {
    table.string('id', 50).primary().comment('account\'s position id primary key')
    table.bigInteger('user_id').notNullable().comment('User\'s ID')
    table.string('account_id', 50).notNullable().comment('User\'s account id')
    table.string('symbol', 255).notNullable().comment('The position\'s related symbol code')
    table.integer('position_type').notNullable().comment('The position\'s type 1:Long Position 2:Short Position')
    table.bigInteger('avg_price').notNullable().comment('The position\'s average trade price for matched qty. unit $0.0001,such as $102.73, the record value is 1027300')
    table.integer('qty').notNullable().comment('The position\'s current qty, such as 50')
    table.integer('total_qty').notNullable().defaultTo(0).comment('The order\'s accumulative trade orders\' qty today')
    table.decimal('realized_pl', 20, 4).notNullable().defaultTo(0).comment('The order\'s realized Profit & Loss amount')
    table.integer('frozen_qty').notNullable().defaultTo(0).comment('The position\'s frozen quantity')
    table.json('executions').notNullable().comment('The position\'s execution list string, including each order\'s id, price and qty')
    table.timestamp('created_at', { useTz: true }).notNullable().comment('The timestamp of position\'s created time(accurate to milliseconds)')
    table.timestamp('updated_at', { useTz: true }).notNullable().comment('The timestamp of position\'s latest updated time(accurate to milliseconds)')
    table.timestamp('closed_at', { useTz: true }).notNullable().defaultTo(knex.fn.now()).comment('The timestamp of position\'s closed time(accurate to milliseconds), default is 0, means opened')

    // Add indexes
    table.index('user_id')
    table.index('account_id')
    table.index('symbol')
    table.index('position_type')
    table.index('created_at')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('orca_sim_position')
}
