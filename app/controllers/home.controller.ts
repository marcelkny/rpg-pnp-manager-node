import { NextFunction, Request, Response } from "express";
import { ErrorMessageArray } from "../utils/errorMessage";

export async function getLandingPage(req: Request, res: Response, next: NextFunction) {
    try {
        const notificationForStartPage = "Everything's allright";

        // eslint-disable-next-line prefer-const
        let errorMessages: ErrorMessageArray = [];

        res.render("pages/landingPage", {
            csrfToken: req.csrfToken(),
            loggedin: req.session.loggedin,
            pageNavId: "status",
            userName: "Dave",
            errorMessage: errorMessages,
            sessionCustomerId: req.session.userId || undefined,
            notification: notificationForStartPage,
        });
    } catch (error) {
        next(error);
    }
}
