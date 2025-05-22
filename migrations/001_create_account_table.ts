// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('orca_sim_account', table => {
    table.string('id', 50).primary().comment('User\'s account id')
    table.bigInteger('user_id').notNullable().comment('User\'s ID')
    table.integer('status').notNullable().defaultTo(1).comment('Account\'s status.1:Active 2:Frozen')
    table.bigInteger('original_payment').notNullable().comment('Account\'s original balance,unit $0.0001,if original balance is 150.72 the record value equals 1507200')
    table.bigInteger('cost').notNullable().defaultTo(0).comment('The accumulated trade cost after each trade, buy: avg price * qty; sell: - avg price * qty')
    table.bigInteger('frozen_payment').notNullable().defaultTo(0).comment('Account\'s freeze balance. unit $0.0001,if the freezed payment is 80.72, the record value equals to 807200')
    table.bigInteger('created_at').notNullable().defaultTo(knex.raw('EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000')).comment('The timestamp of account\'s created time(accurate to milliseconds),if created time is 2025-05-06 14:45:12 292, timestamp is 1746513912292')
    table.bigInteger('updated_at').notNullable().defaultTo(knex.raw('EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000')).comment('The timestamp of account\'s latest updated time(accurate to milliseconds), if update time is 2025-05-06 14:58:26 400, timestamp is 1746514706400')

    // Add indexes
    table.index('user_id')
    table.index('status')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('orca_sim_account')
}
