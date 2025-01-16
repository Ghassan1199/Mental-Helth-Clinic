import { OtpController } from "../../controllers/Otp.Controller";
import express from "express";
import { container } from "tsyringe";

const router = express.Router();

/************************container**************************/
const otpController = container.resolve(OtpController);

/************************ routes ***************************/
router.post("/verify", otpController.verify.bind(otpController));
router.post("/sendOTP", otpController.sendNewOTP.bind(otpController));
router.post("/checkToken", otpController.checkToken.bind(otpController));

export default router;
