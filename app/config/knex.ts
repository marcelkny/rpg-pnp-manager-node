import { DB_PASS_POSTGRES } from "./config";
import { DB_USER_POSTGRES } from "./config";
import { DB_NAME_POSTGRES } from "./config";

export const knexConfig = {
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
};
