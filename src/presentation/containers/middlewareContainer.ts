import { container } from "tsyringe";
import UserAuth from "../middlewares/auth/user.auth";
import AppointmentRequestValidator from "../request/appointmentRequest.request";
import AppointmentCancellationValidator from "../request/appointmentCancellation.request";
import Validator from "../../application/validation/validator";
import UploadHandler from "../middlewares/handlers/upload.handler";
import AdminAuth from "../middlewares/auth/admin.auth";
import BlockedValidator from "../../application/validation/isBlocked";

// Register middlewares
container.registerSingleton(UserAuth);
container.registerSingleton(AppointmentRequestValidator);
container.registerSingleton(AppointmentCancellationValidator);
container.registerSingleton(Validator);
container.registerSingleton(UploadHandler);
container.registerSingleton(AdminAuth);
container.registerSingleton(BlockedValidator);

export { container as middlewareContainer };
