import express from "express";
import { statusPage, statusPong, statusVersion } from "../controllers/status.controller";

const statusRouter = express.Router({ mergeParams: true });

statusRouter.get("/ping", statusPong);
statusRouter.get("/page", statusPage);
statusRouter.get("/version", statusVersion);

export default statusRouter;
