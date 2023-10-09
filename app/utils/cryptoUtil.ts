import bcrypt from "bcrypt";
import { BCRYPT_SALT_ROUNDS } from "../config/config";

export function passwordHash(password: string): string {
    const salt = bcrypt.genSaltSync(BCRYPT_SALT_ROUNDS);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

export function passwordVerify(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
}
