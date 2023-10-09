export function registerGracefulShutdownHandler(handler: () => Promise<void | number>) {
    // gracefull shutdown on CTRL+C / Terminate
    const shutdownHandler = async function () {
        const res = await handler();
        if (typeof res === "number" && !Number.isNaN(res)) {
            process.exit(res);
        } else {
            process.exit(0);
        }
    };

    process.on("SIGTERM", shutdownHandler);
    process.on("SIGINT", shutdownHandler);
}
