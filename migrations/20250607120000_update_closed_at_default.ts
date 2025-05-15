import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Add a new column with the correct type and default
  await knex.schema.alterTable('orca_sim_position', (table) => {
    table.bigInteger('closed_at_new').notNullable().defaultTo(0).comment('The timestamp of position\'s closed time in ms, 0 means opened');
  });

  // Copy over existing values (convert if needed)
  await knex.raw(`
    UPDATE orca_sim_position
    SET closed_at_new = 
      CASE 
        WHEN closed_at IS NULL THEN 0
        WHEN closed_at > 1000000000000 THEN closed_at -- already ms
        ELSE EXTRACT(EPOCH FROM to_timestamp(closed_at)) * 1000 -- convert if needed
      END
  `);

  // Drop the old column and rename the new one
  await knex.schema.alterTable('orca_sim_position', (table) => {
    table.dropColumn('closed_at');
  });
  await knex.schema.alterTable('orca_sim_position', (table) => {
    table.renameColumn('closed_at_new', 'closed_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  // Revert to a timestamp column with no default
  await knex.schema.alterTable('orca_sim_position', (table) => {
    table.timestamp('closed_at_old');
  });

  // Convert ms back to timestamp
  await knex.raw(`
    UPDATE orca_sim_position
    SET closed_at_old = to_timestamp(closed_at / 1000.0)
  `);

  // Drop the bigint column and rename the old one back
  await knex.schema.alterTable('orca_sim_position', (table) => {
    table.dropColumn('closed_at');
  });
  await knex.schema.alterTable('orca_sim_position', (table) => {
    table.renameColumn('closed_at_old', 'closed_at');
  });
} 