import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("password_resets", function (table) {
        table.bigIncrements();
        table.integer("user_id");
        table.foreign("user_id").references("users.id");

        table.text("token").unique({ indexName: "token_index", deferrable: "immediate" });

        table.timestamps(true, true, false);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("password_resets");
}
