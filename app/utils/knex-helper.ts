interface IdResult<T> {
    id: T;
}

type IdResultArray<T> = Array<IdResult<T>>;

export function isResultWithBigSerial(item: any): item is IdResultArray<string> {
    return Array.isArray(item) && item.reduce((prev, cur) => prev && "id" in cur && typeof cur.id === "string", true);
}
