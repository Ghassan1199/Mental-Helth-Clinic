import { container } from "tsyringe";
import { AppointmentRequestController } from "../controllers/appointment/AppointmentRequest.Controllers";
import { AppointmentCancellationController } from "../controllers/appointment/AppointmentCancellation.Controller";
import { AppointmentController } from "../controllers/appointment/Appointment.Controller";
import { AdminController } from "../controllers/admin/Admin.Controller";
import { CategoryController } from "../controllers/category/Category.Controller";
import { CityController } from "../controllers/city/City.Controller";
import { CodeController } from "../controllers/code/Code.Controller";
import { MedicalRecordController } from "../controllers/medical-record/MedicalRecord.Controller";
import { RegistrationController } from "../controllers/registration/Registration.Controller";
import { SpecialistProfileController } from "../controllers/specs/SpecialistProfile.Controller";
import { SpecialistController } from "../controllers/specs/Specialist.Controller";
import { WithdrawController } from "../controllers/withdraw/Withdraw.Controller";
import { ChatController } from "../controllers/Chat.Controller";
import { ClinicController } from "../controllers/Clinic.Controller";
import { OtpController } from "../controllers/Otp.Controller";
import { RateController } from "../controllers/RateController";
import { UserController } from "../controllers/User.auth.Controller";
import { SessionInfoController } from "../controllers/sessionInfo/sessionInfo.controller";
import { BotScoreController } from "../controllers/bot-score/BotScore.controller";
import { BlockController } from "../controllers/block/block.controller";
import { ReportController } from "../controllers/report/Report.Controller";

// Register controllers
/************************** Appointment *******************************/
container.registerSingleton(AppointmentRequestController);
container.registerSingleton(AppointmentController);
container.registerSingleton(AppointmentCancellationController);

/************************** admin *******************************/
container.registerSingleton(AdminController);

/************************** Category *******************************/
container.registerSingleton(CategoryController);

container.registerSingleton(ChatController);

/************************** City *******************************/
container.registerSingleton(CityController);

/************************** Clinic *******************************/
container.registerSingleton(ClinicController);

/************************** code *******************************/
container.registerSingleton(CodeController);

/************************** MedicalRecord *******************************/
container.registerSingleton(MedicalRecordController);

/************************** otp *******************************/
container.registerSingleton(OtpController);

/************************** rate *******************************/
container.registerSingleton(RateController);

/************************** Registration *******************************/
container.registerSingleton(RegistrationController);

/************************** SessionInfo *******************************/
container.registerSingleton(SessionInfoController);

/************************** Specialist *******************************/
container.registerSingleton(SpecialistProfileController);
container.registerSingleton(SpecialistController);

/************************** Withdraw *******************************/
container.registerSingleton(WithdrawController);

/************************** User *******************************/
container.registerSingleton(UserController);

/************************** BotScore *******************************/
container.registerSingleton(BotScoreController);

/************************** Block *******************************/
container.registerSingleton(BlockController);


/************************** Report *******************************/
container.registerSingleton(ReportController);

export { container as controllerContainer };
