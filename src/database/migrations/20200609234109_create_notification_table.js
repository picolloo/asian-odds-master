exports.up = function (knex) {
  return knex.schema.createTable("notifications", (table) => {
    table.increments("id");
    table.string("name").notNullable();
    table.decimal("teamFactor").notNullable();
    table.decimal("homePrice").notNullable();
    table.decimal("guestPrice").notNullable();
    table.boolean("placedBet").defaultTo(false);
    table.timestamp("createdAt").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("notifications");
};
