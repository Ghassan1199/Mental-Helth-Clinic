import { UserController } from "../../controllers/User.auth.Controller";
import UserValidator from "../../request/userRegister.request";
import UserAuth from "../../middlewares/auth/user.auth";
import express from "express";
import { container } from "tsyringe";
import { RedeemController } from "../../controllers/userRedeem/userRedeemController";

const router = express.Router();

/************************container**************************/
const userController = container.resolve(UserController);
const userAuth = container.resolve(UserAuth);
const userValidator = container.resolve(UserValidator);
const redeemController = container.resolve(RedeemController);

/************************ routes ***************************/
router.post(
  "/register",
  userValidator.createUserSchema(),
  userController.register.bind(userController)
);

router.post("/login",   userValidator.loginUserSchema         (),
userController.login.bind(userController));

router.post("/checkEmail", userController.checkEmail.bind(userController));

router.post(
  "/forgetPassword",
  userController.forgotPassword.bind(userController)
);
router.post(
  "/resetPassword",
  [userAuth.checkUser],
  userController.resetPassword.bind(userController)
);
router.get(
  "/profile",
  [userAuth.checkUser],
  userController.show.bind(userController)
);


router.post(
  "/redeemCode",
  [userAuth.checkUser],
  redeemController.redeemTransaction.bind(redeemController)
);
export default router;
