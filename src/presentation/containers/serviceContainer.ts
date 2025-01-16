import { container } from "tsyringe";
import { AppointmentService } from "../../application/services/appointment/Appointment.Service";
import { AppointmentRequestService } from "../../application/services/appointment/Appointment.Request.Service";
import { ClinicService } from "../../application/services/Clinic.Service";
import JwtService from "../../application/services/jwt.Service";
import { WalletService } from "../../application/services/Wallet.Service";
import { TransactionService } from "../../application/services/Transaction.Service";
import { AppointmentCancellationService } from "../../application/services/appointment/Appointment.Cancellation.Service";
import { AdminService } from "../../application/services/admin/admin.service";
import { CategoryService } from "../../application/services/category/Category.Service";
import { ChatService } from "../../application/services/chat/Chat.Service";
import { CityService } from "../../application/services/city/City.Service";
import { CodeService } from "../../application/services/codes/Code.Service";
import { MedicalRecordService } from "../../application/services/medical-record/MedicalRecord.Service";
import OtpService from "../../application/services/Otp.Service";
import { RateService } from "../../application/services/Rate.service";
import { RegistrationService } from "../../application/services/registration/Registration.Service";
import { SpecialistProfileService } from "../../application/services/specs/SpecialistProfile.Service";
import { SpecialistService } from "../../application/services/specs/Specialist.Service";
import { WithdrawService } from "../../application/services/withdraw/Withdraw.Service";
import { UserService } from "../../application/services/patient/Patient.auth.Service";
import { EmailService } from "../../application/services/Email.Service";
import Scheduler from "../../application/services/Scheduler.Service";
import { SessionInfoService } from "../../application/services/sessionInfo/SessionInfo.Service";
import { BotScoreService } from "../../application/services/bot-score/BotScore.Service";
import { BlockService } from "../../application/services/block/Block.Service";
import { ReportService } from "../../application/services/report/Report.Service";

// Register services
/************************** Appointment *******************************/
container.registerSingleton(AppointmentService);
container.registerSingleton(AppointmentRequestService);
container.registerSingleton(AppointmentCancellationService);

/************************** admin *******************************/
container.registerSingleton(AdminService);

/************************** Category *******************************/
container.registerSingleton(CategoryService);

/************************** Chat *******************************/
container.registerSingleton(ChatService);

/************************** City *******************************/
container.registerSingleton(CityService);

/************************** Clinic *******************************/
container.registerSingleton(ClinicService);

/************************** code *******************************/
container.registerSingleton(CodeService);

/************************** email *******************************/
container.registerSingleton(EmailService);

/************************** JWT *******************************/
container.registerSingleton(JwtService);

/************************** MedicalRecord *******************************/
container.registerSingleton(MedicalRecordService);

/************************** otp *******************************/
container.registerSingleton(OtpService);

/************************** rate *******************************/
container.registerSingleton(RateService);

/************************** Registration *******************************/
container.registerSingleton(RegistrationService);

/************************** Scheduler *******************************/
container.registerSingleton(Scheduler);

/************************** SessionInfo *******************************/
container.registerSingleton(SessionInfoService);


/************************** Specialist *******************************/
container.registerSingleton(SpecialistProfileService);
container.registerSingleton(SpecialistService);

/************************** Transaction *******************************/
container.registerSingleton(TransactionService);

/************************** Withdraw *******************************/
container.registerSingleton(WithdrawService);

/************************** User *******************************/
container.registerSingleton(UserService);

/************************** wallet *******************************/
container.registerSingleton(WalletService);


/************************** BotScore *******************************/
container.registerSingleton(BotScoreService);


/************************** Block *******************************/
container.registerSingleton(BlockService);

/************************** Report *******************************/
container.registerSingleton(ReportService);


export { container as serviceContainer };
