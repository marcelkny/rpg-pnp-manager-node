import { NextFunction, Request, Response } from "express";
import { DEBUG, DEVELOPMENT } from "../config/config";
import { NotFoundError } from "../utils/errors";

/**
 * 404 Handler
 *
 * @param req
 * @param res
 */
export function pageNotFoundHandler(req: Request, res: Response) {
    res.status(404).json({
        code: 404,
        type: "Not Found",
        message: "Resource not found!",
    });
}

/**
 * Output Error to stderr
 *
 * @param err
 * @param req
 * @param res
 * @param next
 */
export function logErrorHandler(err: Error | unknown, req: Request, res: Response, next: NextFunction) {
    // output stacktrace
    console.error(err instanceof Error ? err.stack : err);
    next(err);
}

/**
 * Respond with error / status 500 for API Requests
 *
 * @param err
 * @param req
 * @param res
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function reportErrorHandler(err: Error | unknown, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        // skip error response since header/data was already send
        next(err);
        return;
    }
    if (err instanceof NotFoundError) {
        res.status(404);
        const message = { type: "Not Found", code: 404, message: "Not Found" };
        if (DEVELOPMENT && DEBUG) {
            // additionally output stack trace or error if possible
            res.send({ ...message, error: err instanceof Error ? (err.stack ?? "").replace("\r", "").split("\n") : err });
        } else {
            res.send(message);
        }
        return;
    }
    // respond with 500 "Internal Server Error".
    res.status(500);
    const message = { type: "Internal Server Error", code: 500, message: "Internal Server Error" };
    if (DEVELOPMENT && DEBUG) {
        // additionally output stack trace or error if possible
        res.send({ ...message, error: err instanceof Error ? (err.stack ?? "").replace("\r", "").split("\n") : err });
        return;
    }
    res.send(message);
    next(err);
}
