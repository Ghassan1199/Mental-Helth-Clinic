import express from "express";
import UserAuth from "../middlewares/auth/user.auth";
import { ClinicController } from "../controllers/Clinic.Controller";
import { RateController } from "../controllers/RateController";
import RateValidator from "../request/rate.request";
import { container } from "tsyringe";

const router = express.Router();

/************************container**************************/
const userAuth = container.resolve(UserAuth);
const rateValidator = container.resolve(RateValidator);
const rateController = container.resolve(RateController);
const clinicController = container.resolve(ClinicController);

/************************ routes ***************************/
router.use(userAuth.checkUser);

router.get("/", clinicController.index.bind(clinicController));

router.get("/doctors", clinicController.getAllDoctors.bind(clinicController));

router.get(
  "/doctors/:doctorId/profile",
  clinicController.getDoctorProfile.bind(clinicController)
);

router.post(
  "/rate",
  [rateValidator.createRateSchema()],
  rateController.create.bind(rateController)
);

export default router;
