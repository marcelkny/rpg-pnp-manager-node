export interface TokenModel {
    // should be bigint, but returns as string
    id: string;
    id_user: string;
    token: string;
    jwt: string;
}

/**
 * check if item is of type AccountModel and contains email & password
 * @param item item to be checked
 * @returns return true or false
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isTokenModel(item: any): item is TokenModel {
    return (
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        typeof item.id === "string" &&
        "id_user" in item &&
        typeof item.id_user === "string" &&
        "token" in item &&
        typeof item.token === "string" &&
        "jwt" in item &&
        typeof item.jwt === "string"
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isTokenModelArray(item: any): item is TokenModel[] {
    return typeof item === "object" && item !== null && Array.isArray(item) && item.reduce((prev: boolean, cur: TokenModel) => prev && isTokenModel(cur), true);
}
