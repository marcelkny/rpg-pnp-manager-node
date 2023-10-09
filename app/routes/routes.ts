import { Express } from "express-serve-static-core";
import statusRouter from "./status.routes";
import homeRouter from "./home.routes";
import authRouter from "./auth_routes/auth.routes";

export default function registerRoutes(app: Express) {
    app.use("/", homeRouter);
    app.use("/auth", authRouter);
    app.use("/status", statusRouter);
}
