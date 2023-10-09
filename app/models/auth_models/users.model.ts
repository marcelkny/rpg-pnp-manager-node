export const USER_TABLE_NAME = "user";

export interface UsersModel {
    // should be bigint, but returns as string
    id: string;
    username: string;
    email: string;
    password: string;
    // rfc 3339 timestamp
    created_at: Date;
    updated_at: Date;
    // optional timestamp
    email_verified?: Date;
}

/**
 * check if item is of type UserModel and contains email & password
 * @param item item to be checked
 * @returns return true or false
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isUsersModel(item: any): item is UsersModel {
    return (
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        typeof item.id === "string" &&
        "email" in item &&
        typeof item.email === "string" &&
        "password" in item &&
        typeof item.password === "string" &&
        "created_at" in item &&
        item.created_at instanceof Date &&
        "updated_at" in item &&
        item.updated_at instanceof Date &&
        "email_verified" in item &&
        (item.email_verified === null || item.email_verified instanceof Date)
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isUsersModelArray(item: any): item is UsersModel[] {
    return typeof item === "object" && item !== null && Array.isArray(item) && item.reduce((prev: boolean, cur: UsersModel) => prev && isUsersModel(cur), true);
}
