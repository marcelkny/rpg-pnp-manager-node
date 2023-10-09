import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("users", function (table) {
        table.bigIncrements();
        table.timestamps(true, true, false);
        table.string("username").notNullable();
        table.string("email").notNullable().unique({ indexName: "email_unique_id", deferrable: "immediate" });
        table.string("password").notNullable();
        table.timestamp("email_verified");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("users");
}
