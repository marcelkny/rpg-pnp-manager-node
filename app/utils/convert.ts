export function stringToNumDefault(s?: string, fallback: number = 0): number {
    const num = Number(s);
    if (Number.isNaN(num)) {
        return fallback;
    }
    return num;
}
