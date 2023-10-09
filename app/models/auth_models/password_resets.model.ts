export interface PasswordResetsModel {
    // should be bigint, but returns as string
    id: string;
    user_id: string;
    token: string;
    // rfc 3339 timestamp
    created_at: Date;
    updated_at: Date;
}

/**
 * check if item is of type PasswordResetsModel and contains email & password
 * @param item item to be checked
 * @returns return true or false
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPasswordResetsModel(item: any): item is PasswordResetsModel {
    return (
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        typeof item.id === "string" &&
        "user_id" in item &&
        typeof item.user_id === "number" &&
        "token" in item &&
        typeof item.token === "string" &&
        "created_at" in item &&
        item.created_at instanceof Date &&
        "updated_at" in item &&
        item.updated_at instanceof Date
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPasswordResetsModelArray(item: any): item is PasswordResetsModel[] {
    console.log("item:", item);
    console.log("typeof item:", typeof item);
    console.log("typeof item.id:", typeof item.id);
    console.log("typeof item.user_id:", typeof item.user_id);
    console.log("typeof item.token:", typeof item.token);
    console.log("typeof item.created_at:", typeof item.created_at);
    console.log("typeof item.updated_at:", typeof item.updated_at);
    console.log("Array:", Array.isArray(item));
    return (
        typeof item === "object" &&
        item !== null &&
        Array.isArray(item) &&
        item.reduce((prev: boolean, cur: PasswordResetsModel) => prev && isPasswordResetsModel(cur), true)
    );
}
