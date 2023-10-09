import express from "express";
import csrf from "csurf";
import bodyParser from "body-parser";
import {
    getPasswordReset,
    postLogin,
    postLogout,
    postPasswordReset,
    verifyPasswordReset,
    verifyPasswords,
} from "../../controllers/auth_controllers/auth.controller";
import { checkLogin } from "../../middleware/checkLogin.middleware";
const csrfProtect = csrf({ cookie: true });
const parseForm = bodyParser.urlencoded({ extended: false });

const authRouter = express.Router({ mergeParams: true });

authRouter.post("/login", parseForm, csrfProtect, postLogin);
authRouter.post("/logout", parseForm, csrfProtect, checkLogin, postLogout);
//
authRouter.get("/reset", csrfProtect, getPasswordReset);
authRouter.post("/resetsend", parseForm, csrfProtect, postPasswordReset);
authRouter.post("/checkpw", parseForm, csrfProtect, verifyPasswords);
authRouter.get("/verify", parseForm, csrfProtect, verifyPasswordReset);

export default authRouter;
