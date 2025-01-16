import express from "express";
import { container } from "tsyringe";
import { AppointmentRequestController } from "../../controllers/appointment/AppointmentRequest.Controllers";
import UserAuth from "../../middlewares/auth/user.auth";
import AppointmentRequestValidator from "../../request/appointmentRequest.request";

const router = express.Router();
/*********************to get user************************/

const userAuth = container.resolve(UserAuth);
const appointmentRequestValidator = container.resolve(
  AppointmentRequestValidator,
);
const appointmentRequestController = container.resolve(
  AppointmentRequestController,
);

/************************ routes *************************/
router.use(userAuth.checkUser);
router.post(
  "/clinic/:clinicId",
  [appointmentRequestValidator.createAppointmentRequestSchema()],
  appointmentRequestController.create.bind(appointmentRequestController),
);

router.post(
  "/specialist/createRequest",
  appointmentRequestController.createBySpec.bind(appointmentRequestController),
);

router.get(
  "/specialist",
  appointmentRequestController.index.bind(appointmentRequestController),
);

router.get(
  "/patient",
  appointmentRequestController.patientRequest.bind(
    appointmentRequestController,
  ),
);

router.post(
  "/:id/set-date",
  appointmentRequestController.setDate.bind(appointmentRequestController),
);

router.post(
  "/:id/reject",
  appointmentRequestController.reject.bind(appointmentRequestController),
);

router.get(
  "/:id/patient/accept",
  appointmentRequestController.accept.bind(appointmentRequestController),
);

router.get(
  "/:id/patient/refuse",
  appointmentRequestController.refuse.bind(appointmentRequestController),
);

/*
router.get(
    "/get-transactions",
    appointmentRequestController.accept.bind(appointmentRequestController)
);*/

router.get(
  "/home",
  appointmentRequestController.accept.bind(appointmentRequestController),
);

router.delete(
  "/:id",
  appointmentRequestController.destroy.bind(appointmentRequestController),
);

export default router;
