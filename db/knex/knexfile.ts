import { Knex } from "knex";
import { env } from "process";

export const DB_NAME_POSTGRES = env.POSTGRES_DB;
export const DB_USER_POSTGRES = env.POSTGRES_USER;
export const DB_PASS_POSTGRES = env.POSTGRES_PASSWORD;

// see ./app/confi/knex.ts
module.exports = {
    client: "postgresql",
    connection: {
        host: "postgres",
        database: DB_NAME_POSTGRES,
        user: DB_USER_POSTGRES,
        password: DB_PASS_POSTGRES,
        port: 5432,
    },
    pool: {
        min: 2,
        max: 10,
    },
    migrations: {
        tableName: "knex_migrations",
        directory: "./migrations/",
    },
    seeds: {
        directory: "./seeds/",
    },
} as Knex.Config;
