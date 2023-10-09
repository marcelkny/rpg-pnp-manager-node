import dotenv from "dotenv";
import { env } from "process";
import { stringToNumDefault } from "../utils/convert";

dotenv.config({ path: "/app/app.env" });
export const APP_KEY = env.APP_KEY ?? "The quick brown fox jumps over the lazy dog";
export const APP_KEY_FIELD = env.APP_KEY_FIELD ?? "X-APIKEY";

export const DEBUG = env.APP_DEBUG == "true" || false;
export const DEVELOPMENT = env.APP_DEVELOPMENT == "true" || false;
export const API_PORT = stringToNumDefault(env.APP_PORT, 9000);
export const APP_SECRET = env.APP_SECRET;
export const APP_VERSION = env.APP_VERSION ?? "none";
export const APP_SESSION_KEY = env.APP_SESSION_KEY ?? "something secret";
export const APP_COOKIE_SECURE = env.APP_COOKIE_SECURE === "true" ?? true;
export const APP_COOKIE_HTTPONLY = env.APP_COOKIE_HTTPONLY === "true" ?? true;
export const APP_URL = env.APP_URL ?? "";

export const APP_STORAGE_PATH = env.APP_STORAGE_PATH ?? "storage";

export const DB_NAME_POSTGRES = env.DB_NAME ?? "test";
export const DB_USER_POSTGRES = env.DB_USER ?? "";
export const DB_PASS_POSTGRES = env.DB_PASSWORD ?? "";

export const BCRYPT_SALT_ROUNDS = 12;
