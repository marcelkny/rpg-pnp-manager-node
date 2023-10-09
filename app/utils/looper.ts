/**
 * Loop Handler Type
 */
export type LoopHandler = () => void | never | boolean | Promise<void> | Promise<boolean>;

/**
 * Shutdown Handler Type
 */
export type ShutdownHandler = () => void;

/**
 * Custom Error Class
 */
export class LooperError extends Error {}

/**
 * Exception for Fast Exit
 */
export class LooperExit extends Error {}

/**
 * Looper Singleton
 */
export class Looper {
    private static looper?: Looper;

    public static logHandler = (message: string, extra: string) => {
        console.log(`${message}: ${extra}`);
    };

    /**
     * Set true if looper should not reschedule the handler
     *
     * @static
     * @type {boolean}
     * @memberof Looper
     */
    public static shouldShutdown: boolean = false;

    /**
     * Time in ms to wait between reschedule to reduce CPU Usage
     *
     * @static
     * @type {number}
     * @memberof Looper
     */
    public static wait: number = 1000;

    /**
     * Loop handler to be executed every cycle
     */
    public handler: LoopHandler = () => {
        throw new LooperError("No Loophandler, No Looping, Bye");
    };

    /**
     * Handler that will be called on CTRL-C or OS Termination request (SIGINT/SIGTERM)
     */
    public static shutdownHandler: ShutdownHandler = () => {
        Looper.shouldShutdown = true;
    };

    /**
     * Cycle runner
     *
     * @returns
     */
    private async run() {
        const _instance = Looper.looper;
        if (_instance === undefined) {
            throw new LooperError("No Looper, No Looping, Bye");
        }
        // check shutdown condition
        if (Looper.shouldShutdown) {
            Looper.logHandler("Graceful Shutdown", "bye");
            return;
        }
        // execute handler
        const handler = _instance.handler;
        try {
            const res = await handler();
            if (typeof res === "boolean" && res === false) {
                Looper.logHandler("Looper Exit", "termination request");
                return;
            }
        } catch (e) {
            if (e instanceof LooperExit) {
                Looper.logHandler("Looper Exit", e.message);
                return;
            }
            throw e;
        }
        // again, check shutdown condition
        if (Looper.shouldShutdown) {
            Looper.logHandler("Graceful Shutdown", "bye");
            return;
        }
        // reschedule for another cycle
        setTimeout(_instance.run, Looper.wait);
    }

    /**
     * Register handler and startup loop
     *
     * @param handler
     * @param registerShutdownHandler
     * @returns
     */
    public static async loop(handler: LoopHandler, registerShutdownHandler: boolean = true) {
        const instance = new Looper();
        instance.handler = handler;
        Looper.looper = instance;
        if (registerShutdownHandler) {
            process.on("SIGTERM", Looper.shutdownHandler);
            process.on("SIGINT", Looper.shutdownHandler);
        }
        await instance.run();
        return instance;
    }
}
