export function handleDate(datestring: any, key?: string) {
    if (+new Date(datestring) === datestring) {
        switch (key) {
            case "H_M_S":
                return new Date(datestring).toLocaleTimeString("de-DE", {
                    timeZone: "Europe/Berlin",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                });
            case "H_M":
                return new Date(datestring).toLocaleTimeString("de-DE", {
                    timeZone: "Europe/Berlin",
                    hour: "2-digit",
                    minute: "2-digit",
                });
            case "Y_M_D":
                return new Date(datestring).toLocaleDateString("de-DE", {
                    timeZone: "Europe/Berlin",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                });
            default:
                return new Date(datestring).toLocaleDateString("de-DE", {
                    timeZone: "Europe/Berlin",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                });
        }
    } else {
        return "kein Datum";
    }
}

// function isValidDate(d: any) {
//     return d instanceof Date && d.toString() !== "ungultiges Datum";
// }
