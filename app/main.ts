import express from "express";
import session from "express-session";
import { API_PORT, APP_COOKIE_HTTPONLY, APP_COOKIE_SECURE, APP_SESSION_KEY, APP_VERSION } from "./config/config";
import { connectDatabase } from "./database/connection";
import { logErrorHandler, pageNotFoundHandler, reportErrorHandler } from "./middleware/error.middleware";
import registerRoutes from "./routes/routes";
import cors from "cors";
import { registerGracefulShutdownHandler } from "./utils/sysutils";
import cookieParser from "cookie-parser";
import Logger from "./config/logger";
import fs from "fs";
import morgan from "morgan";
import morganMiddleware from "./middleware/morganMiddleware";
import { storagePath } from "./utils/pathes";
import { JSONResponse } from "./utils/http-request";

const app = express();

app.locals.app_version = APP_VERSION;

app.use(cookieParser());
app.use(morganMiddleware);
app.use(cors());
const sess = {
    secret: APP_SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: APP_COOKIE_SECURE, httpOnly: APP_COOKIE_HTTPONLY },
};

if (app.get("env") === "production") {
    app.set("trust proxy", 1); // trust first proxy
    sess.cookie.secure = true; // serve secure cookies
}
app.use(session(sess));
// eslint-disable-next-line @typescript-eslint/no-namespace
declare module "express-session" {
    interface SessionData {
        userId: string;
        username: string;
        token: string;
        jwt: string;
        loggedin: boolean;
        notificationMsg: JSONResponse;
    }
}
// log only 4xx and 5xx responses to console
app.use(
    morgan("dev", {
        skip: function (req, res) {
            return res.statusCode < 400;
        },
    })
);

// log all requests to access.log
app.use(
    morgan("common", {
        stream: fs.createWriteStream(storagePath("logs", "access.log"), { flags: "a" }),
    })
);

// receive data in json format
app.use(express.json());
// receive form (encoded) data
app.use(express.urlencoded({ extended: true }));
// deliver static files
app.use(express.static("./public"));

// set the view engine to ejs
app.set("view engine", "ejs");

// routes
registerRoutes(app);

// must be last!
app.use(pageNotFoundHandler);
app.use(logErrorHandler);
app.use(reportErrorHandler);

async function startUpServer() {
    const server = app.listen(API_PORT, () => {
        Logger.info(`app listening at http://localhost:${API_PORT}`);
    });
    registerGracefulShutdownHandler(async () => {
        server.close(() => {
            Logger.info("Server terminated, cya!");
        });
    });
    return server;
}

async function StartUp() {
    await connectDatabase();
    await startUpServer();
}

StartUp().catch(function (e) {
    Logger.error("Error Initializing Server or Database Connection", e);
});
