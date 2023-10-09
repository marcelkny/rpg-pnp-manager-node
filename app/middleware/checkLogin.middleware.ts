import { NextFunction, Request, Response } from "express";
import TokenRepository from "../repositories/auth_repositories/token.repository";

export async function checkLogin(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.session.token || !req.session.jwt) {
            res.redirect("/");
            return;
        }

        const result = await new TokenRepository().getTokenAndUserByToken(req.session.token);

        if (result[0].jwt !== req.session.jwt) {
            res.redirect("/");
            return;
        }
        next();
    } catch (e) {
        next(e);
    }
}
