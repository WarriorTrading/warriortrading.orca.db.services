// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('orca_sim_order', table => {
    table.string('id', 50).primary().comment('account\'s order id primary key')
    table.bigInteger('user_id').notNullable().comment('User\'s ID')
    table.string('account_id', 50).notNullable().comment('User\'s account id')
    table.string('symbol', 255).notNullable().comment('The order\'s related symbol code')
    table.string('exchange_code').comment('The order\'s exchange organization code,such as NSDQ,default is empty')
    table.integer('side').notNullable().comment('The order\'s trading side 1:buy 2:sell 3:sell short')
    table.integer('order_type').notNullable().comment('The order\'s type code 1:market order 2:limit order')
    table.integer('trade_type').notNullable().defaultTo(1).comment('The order\'s trader type code 1:day 2:gtc 3:ioc, default is day')
    table.integer('status').notNullable().defaultTo(1).comment('The order\'s status: 1:NEW Order has been accepted but not yet processed, 2:VALIDATED Order is validated successfully and waits for being matched, 3:FILLED Order has been completely matched, 4:REJECTED Order has been rejected due to validation failure, 5:EXPIRED order\'s processing time exceeds the trading hours, 6:CANCELLED Order has been cancelled')
    table.boolean('is_cancelling').notNullable().defaultTo(false).comment('true for cancelling, default: false')
    table.bigInteger('price').notNullable().comment('The order\'s ask/bid price. unit $0.0001,such as $105.73, the record value is 1057300')
    table.bigInteger('avg_exec_price').notNullable().defaultTo(0).comment('The order\'s average execution price for matched qty. unit $0.0001,such as $102.73, the record value is 1027300')
    table.integer('qty').notNullable().comment('The order\'s trade quantity, such as 50')
    table.integer('filled_qty').notNullable().defaultTo(0).comment('The order\'s matched quantity, such as 20')
    table.bigInteger('cost').notNullable().defaultTo(0).comment('buy: avg price * qty; sell: - avg price * qty')
    table.bigInteger('frozen_payment').notNullable().defaultTo(0).comment('The frozen account\'s balance of this order,unit:$0.0001')
    table.integer('frozen_qty').notNullable().defaultTo(0).comment('The frozen quantity of this order')
    table.string('rejection_reason').comment('The order\'s rejection reason')
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now()).comment('The timestamp of order\'s created time(accurate to milliseconds)')
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now()).comment('The timestamp of order\'s latest updated time(accurate to milliseconds)')

    // Add indexes
    table.index('user_id')
    table.index('account_id')
    table.index('symbol')
    table.index('status')
    table.index('side')
    table.index('created_at')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('orca_sim_order')
}
