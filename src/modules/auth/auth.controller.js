import { Router } from "express";
import * as authservice from "./services/auth.services.js"
import * as authvalidation from "../../modules/auth/auth.validation.js"
import * as loginservice from "../auth/services/login.services.js"
import { validation } from "../../middleware/validation.middleware.js";
const router=Router()
router.post("/signup",validation(authvalidation.signup),authservice.signup)
router.post("/confirmemail",validation(authvalidation.confirmemail),authservice.confirmemail)
router.post("/login",validation(authvalidation.login),loginservice.login)
router.post("/forgetpassword",validation(authvalidation.forgetpassword),loginservice.forgotpassword)
router.post("/resetpassword",validation(authvalidation.resetpassword),loginservice.resetpassword)
router.post("/getrefreshtoken",loginservice.getrefreshtoken)
router.post("/loginWithGmail",loginservice.loginwithgmail)
export default router