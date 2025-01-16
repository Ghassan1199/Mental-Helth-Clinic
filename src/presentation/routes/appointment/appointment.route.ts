import express from "express";
import UserAuth from "../../middlewares/auth/user.auth";
import { AppointmentController } from "../../controllers/appointment/Appointment.Controller";
import { container } from "tsyringe";

const router = express.Router();
/************************container**************************/

const userAuth = container.resolve(UserAuth);
const appointmentController = container.resolve(AppointmentController);

/************************ routes ***************************/

router.use(userAuth.checkUser);

router.post(
  "/complete",
  appointmentController.complete.bind(appointmentController),
);

router.get(
  "/check/:appoId",
  appointmentController.checkAppo.bind(appointmentController),
);

router.get(
  "/specialist",
  appointmentController.getClinicAppointment.bind(appointmentController),
);

router.get(
  "/patient",
  appointmentController.getUserAppointment.bind(appointmentController),
);

router.get("/home", appointmentController.home.bind(appointmentController));

router.get(
  "/:appointmentId",
  appointmentController.show.bind(appointmentController),
);

export default router;
