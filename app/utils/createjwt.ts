import crypto from "crypto";
import { APP_SECRET } from "../config/config";
import { InternalError } from "./errors";

export function createJWT(payload: any) {
    const header = {
        alg: "HS256",
        typ: "JWT",
    };

    // Defining key
    const secret = APP_SECRET;
    if (secret === undefined) {
        throw new InternalError("no secret given");
    }

    const data = Buffer.from(JSON.stringify(header), "utf8").toString("base64") + "." + Buffer.from(JSON.stringify(payload), "utf8").toString("base64");

    // Calling createHmac method
    const hash = crypto
        .createHmac("sha256", secret)

        // updating data
        .update(JSON.stringify(data))

        // Encoding to be used
        .digest("hex");

    // Displays output
    console.log(hash);
    return hash;
}
