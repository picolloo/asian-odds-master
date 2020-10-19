require("dotenv-safe").config();
const path = require("path");

module.exports = {
  development: {
    client: "pg",
    connection: {
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PWD,
      port: process.env.DB_PORT,
    },
    migrations: {
      directory: path.resolve(__dirname, "src", "migrations"),
    },
    useNullAsDefault: true,
  },
  production: {
    client: "pg",
    connection: {
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PWD,
      port: process.env.DB_PORT,
    },
    migrations: {
      directory: path.resolve(__dirname, "src", "migrations"),
    },
    useNullAsDefault: true,
  },
};
