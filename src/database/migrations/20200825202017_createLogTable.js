exports.up = function (knex) {
  return knex.schema.createTable("logs", (table) => {
    table.string("level").notNullable();
    table.string("message").notNullable();
    table.json("meta");
    table.timestamp("timestamp").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("logs");
};
