import { Request, Response } from "express";
import { APP_VERSION } from "../config/config";

export function statusPong(req: Request, res: Response) {
    console.log("stuff from other api, sending status");
    res.send({ msg: "alive" });
}

export function statusPage(req: Request, res: Response) {
    res.render("pages/status");
}

export function statusVersion(req: Request, res: Response) {
    res.send({ msg: APP_VERSION });
}
