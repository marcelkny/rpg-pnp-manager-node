import crypto from "crypto";
import ejs from "ejs";
import { NextFunction, Request, Response } from "express";
import { APP_SECRET, APP_URL } from "../../config/config";
import Logger from "../../config/logger";
import { sendMail } from "../../middleware/mailer";
import PasswordResetsRepository from "../../repositories/auth_repositories/password_reset.repository";
import { createJWT } from "../../utils/createjwt";
import { passwordHash, passwordVerify } from "../../utils/cryptoUtil";
import { NotFoundError } from "../../utils/errors";
import UsersRepository from "../../repositories/auth_repositories/users.repository";
import TokenRepository from "../../repositories/auth_repositories/token.repository";

interface Credentials {
    username: string;
    password: string;
}

function isCredentials(item: any): item is Credentials {
    return (
        typeof item === "object" &&
        item !== null &&
        "username" in item &&
        typeof item.username === "string" &&
        "password" in item &&
        typeof item.password === "string"
    );
}

/**
 * LOGIN
 * @param req Request to handle
 * @param res Reponse to be sent
 */
export async function postLogin(req: Request, res: Response, next: NextFunction) {
    const credentials = req.body;

    if (!isCredentials(credentials)) {
        res.render("/", {
            username: "",
            errors: ["hu?"],
            pageNavId: "login",
        });
        return;
    }

    try {
        const result = await new UsersRepository().getUserByEMail(credentials.username);
        const isValidPass = passwordVerify(credentials.password, result.password);

        if (isValidPass) {
            const inTwoWeeks = new Date(Date.now() + 12096e5);
            const token = crypto.randomBytes(64).toString("hex");
            const jwt = createJWT({
                loggedIn: true,
                name: credentials.username,
                token: APP_SECRET,
                expiration: inTwoWeeks,
                timestamp: new Date(),
            });
            req.session.loggedin = true;
            req.session.username = result.username;
            req.session.userId = result.id;
            req.session.token = token;
            req.session.jwt = jwt;

            await new TokenRepository().createToken(result.id, token, jwt);

            // Redirect to home page
            res.redirect("/");
            return;
        }
    } catch (e) {
        if (!(e instanceof NotFoundError)) {
            next(e);
        }
        next(e);
    }
}

export function postLogout(req: Request, res: Response) {
    const loggingout = req.body.logout;
    if (loggingout === "loggingout") {
        req.session.loggedin = false;
        req.session.destroy(() => {
            // will always fire after session is destroyed
            res.redirect("/");
            return;
        });
    }
}

export function getPasswordReset(req: Request, res: Response) {
    res.render("pages/pwresetform", {
        csrfToken: req.csrfToken(),
        loggedin: false,
        pageNavId: "pwreset",
    });
    return;
}
export async function postPasswordReset(req: Request, res: Response, next: NextFunction) {
    const credentials = req.body;
    try {
        const queryResult = await new UsersRepository().getUserByEMail(credentials.username);
        if (credentials.username === queryResult.email) {
            // Token erzeugen
            const authToken = crypto.randomBytes(30).toString("hex");
            // Token in Postgre speichern
            await new PasswordResetsRepository().createPasswordResets(queryResult.id, authToken);
            const mailTextContent = await ejs.renderFile("views/mail/text/passwordreset.textmail.ejs", {
                userEmail: credentials.username,
                authToken: authToken,
                app_url: APP_URL,
            });
            const mailHtmlContent = await ejs.renderFile("views/mail/html/passwordreset.htmlmail.ejs", {
                userEmail: credentials.username,
                authToken: authToken,
                app_url: APP_URL,
            });
            const mailContent = {
                from: '"SENSORDASH Customer Care" <kny@celloon.de>',
                to: [queryResult.email],
                subject: "Dein Admin Panel Passwortreset für " + queryResult.email,
                text: mailTextContent,
                html: mailHtmlContent,
            };

            sendMail(mailContent);

            // Redirect to home page
            res.redirect("/");
            return;
        }
    } catch (e) {
        next(e);
    }
}

export async function verifyPasswordReset(req: Request, res: Response, next: NextFunction) {
    console.log("starting verifyPasswordReset");
    const queryToken = req.query.t as string;
    const email = req.query.e as string;
    console.log("queryToken", queryToken);

    if (queryToken === undefined) {
        console.log("token undefined");
        res.redirect("/");
        return;
    }

    try {
        const result = await new PasswordResetsRepository().getPasswordResetsByToken(queryToken);
        console.log("result.token: ", result.token);
        res.render("pages/pwreset", {
            csrfToken: req.csrfToken(),
            loggedin: false,
            userEmail: email,
            pageNavId: "pwreset",
            sessionCustomerId: req.session.userId || undefined,
        });
        return;
    } catch (e) {
        console.log(e);
        if (!(e instanceof NotFoundError)) {
            next(e);
        }
    }
    res.redirect("/auth");
}

export async function verifyPasswords(req: Request, res: Response, next: NextFunction) {
    Logger.info("starting verifyPasswords");
    const authData = req.body;
    const email = authData.email;

    if (authData.password1 !== authData.password2) {
        res.render("pages/pwreset", {
            csrfToken: req.csrfToken(),
            loggedin: false,
            pwMatching: false,
            userEmail: email,
            pageNavId: "pwreset",
            sessionCustomerId: req.session.userId || undefined,
        });
        return;
    }

    const hash = passwordHash(authData.password1);
    const queryResult = await new UsersRepository().getUserByEMail(email);
    const userId = queryResult.id;

    try {
        await new UsersRepository().updateUserPassword(userId, hash);
        res.redirect("/");
        return;
    } catch (e) {
        Logger.error(e instanceof Error ? e.message : `${e}`);
        console.error(e);
        if (!(e instanceof NotFoundError)) {
            next(e);
        }
    }
    return "null";
}
