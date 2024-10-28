exports.up = function(knex) {
  return knex.schema.hasColumn('reservations', 'status').then((exists) => {
    if (!exists) {
      return knex.schema.table('reservations', (table) => {
        table.string('status').notNullable().defaultTo('booked');
      });
    }
  });
};

exports.down = function(knex) {
  return knex.schema.table('reservations', (table) => {
    table.dropColumn('status');
  });
};