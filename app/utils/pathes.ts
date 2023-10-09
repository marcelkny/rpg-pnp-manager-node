import path from "path";
import { APP_STORAGE_PATH } from "../config/config";

export function storagePath(...pathComponents: string[]) {
    return path.join(APP_STORAGE_PATH, ...pathComponents);
}

export function removeTrailingSlashes(pathComponent: string) {
    return pathComponent.replace(/\/+$/, "");
}

export function removeLeadingSlashes(pathComponent: string) {
    return pathComponent.replace(/^\/+/, "");
}
