exports.up = function (knex) {
  return knex.schema.createTable("bets", (table) => {
    table.increments("id");
    table.string("reference").unique().notNullable();
    table.integer("retries").defaultTo(0);
    table.string("team").notNullable();
    table.decimal("price").notNullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now());

    table.integer("notificationId").references("id").inTable("notifications");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("bets");
};
