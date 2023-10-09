import knex, { Knex } from "knex";
import { knexConfig } from "../config/knex";

let db: Knex;

const DUMMY_QUERY = "SELECT CURRENT_TIME;";

export async function connectDatabase(): Promise<void> {
    await connection().raw(DUMMY_QUERY);
}

export default function connection(): Knex {
    if (db) return db;
    db = knex(knexConfig);
    return db;
}
