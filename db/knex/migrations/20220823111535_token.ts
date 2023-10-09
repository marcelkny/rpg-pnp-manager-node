import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("token", function (table) {
        table.bigIncrements();
        table.bigInteger("id_user");
        table.foreign("id_user").references("users.id");
        table.string("token");
        table.string("jwt");
        table.timestamps(true, true, false);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("token");
}
