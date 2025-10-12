import { Router } from "express";
import {
  refreshAccessToken,
  registeruser,
  login,
} from "../controllers/authcontroller.js";

import { validate } from "../middlewares/validator.middleware.js";
import {
  forgotpasswordvalidator,
  userChangeCUrrentPasswordValidator,
  userloginvalidator,
  userRegisterValidator,
} from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", userRegisterValidator(), validate, registeruser);
router.post("/login", userloginvalidator(), validate, login);
router.post("/refresh-token", refreshAccessToken);

export default router;
