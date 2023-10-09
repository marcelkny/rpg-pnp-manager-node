import { handleDate } from "../utils/datehandler";

export async function sayHelloWorld() {
    const now = handleDate(Date.now(), "H_M");
    console.log(`hello`);
}
