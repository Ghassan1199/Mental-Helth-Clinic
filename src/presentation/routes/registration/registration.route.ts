import { RegistrationController } from "../../controllers/registration/Registration.Controller";
import express from "express";
import { container } from "tsyringe";

const router = express.Router();

/************************container**************************/
const registrationController = container.resolve(RegistrationController);

/************************ routes ***************************/
router.get("/", registrationController.getAll.bind(registrationController));
router.get(
  "/:requestId",
  registrationController.getRequest.bind(registrationController)
);
router.put(
  "/:requestId/handleRequest",
  registrationController.handleRequest.bind(registrationController)
);

export default router;
