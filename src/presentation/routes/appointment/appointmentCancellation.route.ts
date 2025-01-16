import express from "express";
import UserAuth from "../../middlewares/auth/user.auth";
import { AppointmentCancellationController } from "../../controllers/appointment/AppointmentCancellation.Controller";
import AppointmentCancellationValidator from "../../request/appointmentCancellation.request";
import { container } from "tsyringe";

const router = express.Router();
/************************container**************************/

const userAuth = container.resolve(UserAuth);
const appointmentCancellationController = container.resolve(
  AppointmentCancellationController
);
const appointmentCancellationValidator = container.resolve(
  AppointmentCancellationValidator
);

/************************ routes ***************************/
router.use(userAuth.checkUser); 

router.post(
    "/:appointmentId", [
        appointmentCancellationValidator.createAppointmentCancellationSchema()
    ],
    appointmentCancellationController.create.bind(appointmentCancellationController)
);

export default router;
