import express from "express";
import csrf from "csurf";
import { getLandingPage } from "../controllers/home.controller";

const csrfProtect = csrf({ cookie: true });

const homeRouter = express.Router({ mergeParams: true });

homeRouter.get("/", csrfProtect, getLandingPage);

export default homeRouter;
