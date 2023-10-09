import { randomBytes } from "crypto";
import { Knex } from "knex";
import { passwordHash } from "../../../app/utils/cryptoUtil";
import { initialAdminConfig, initialUserConfig } from "../../../app/utils/userconfig";

export async function seed(knex: Knex): Promise<void> {
    const isProd = (process.env.NODE_ENV || "development") === "production";

    // Add if there is no user
    const userresult = await knex("users").count({ count: "*" });
    if (userresult.length >= 1 && userresult[0].count === "0") {
        if (isProd) {
            // Insert default admin with random string as password
            await knex("users").insert([
                {
                    username: "Super Admin",
                    email: "karbe@celloon.de",
                    password: randomBytes(66).toString("hex"),
                },
                {
                    username: "Admin",
                    email: "kny@celloon.de",
                    password: randomBytes(66).toString("hex"),
                },
                {
                    username: "Chef",
                    email: "kisser@celloon.de",
                    password: randomBytes(66).toString("hex"),
                },
            ]);
        } else {
            const hash = passwordHash("Secret123");

            // Inserts seed entries
            await knex("users").insert([
                {
                    username: "Admin",
                    email: "kny@celloon.de",
                    password: hash,
                },
            ]);
        }
        console.log("knex seeding (users) done");
    } else {
        console.log("postgres schema (users) already exists");
    }
}
