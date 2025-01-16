// src/container/repositoryContainer.ts
import { container } from "tsyringe";
import { AppointmentMysqlRepository } from "../../infrastructure/database/repositories/mysql/appointment/Appointment.mysql.Repository";
import { AppointmentRequestMysqlRepository } from "../../infrastructure/database/repositories/mysql/appointment/AppointmentRequest.mysql.Repository";
import { ClinicMysqlRepository } from "../../infrastructure/database/repositories/mysql/Clinic.mysql.Repository";
import { UserMysqlRepository } from "../../infrastructure/database/repositories/mysql/user.mysql.Repository";
import { TransactionMysqlRepository } from "../../infrastructure/database/repositories/mysql/Transaction.mysql.Repository";
import { WalletMysqlRepository } from "../../infrastructure/database/repositories/mysql/Wallet.mysql.Repository";
import { CodeMysqlRepository } from "../../infrastructure/database/repositories/mysql/code/code.mysql.Repository";
import { RedeemTransactionMysqlRepository } from "../../infrastructure/database/repositories/mysql/RedeemTransaction.mysql.Repository";
import { SpecialistMysqlRepository } from "../../infrastructure/database/repositories/mysql/specs/spec.mysql.Repository";
import { IAppointmentRequestRepository } from "../../domain/interfaces/repositories/appointment/IAppointmentRequestRepository";
import { IAppointmentRepository } from "../../domain/interfaces/repositories/appointment/IAppointmentRepository";
import { IClinicRepository } from "../../domain/interfaces/repositories/IClinicRepository";
import { IUserRepository } from "../../domain/interfaces/repositories/IUserRepository";
import { ISpecialistRepository } from "../../domain/interfaces/repositories/specs/ISpecialist.repository";
import { IWalletRepository } from "../../domain/interfaces/repositories/IWalletRepository";
import { ITransactionRepository } from "../../domain/interfaces/repositories/ITransactionRepository";
import { ICodeRepository } from "../../domain/interfaces/repositories/code/ICodeRepository";
import { IRedeemTransactionRepository } from "../../domain/interfaces/repositories/IRedeemTransactionRepository";
import { IAppointmentCancellationRepository } from "../../domain/interfaces/repositories/appointment/IAppointmentCancellationRepository";
import { AppointmentCancellationMysqlRepository } from "../../infrastructure/database/repositories/mysql/appointment/AppointmentCancellation.mysql.Repository";
import { IAdminRepository } from "../../domain/interfaces/repositories/admin/IAdminRepository";
import { AdminMysqlRepository } from "../../infrastructure/database/repositories/mysql/admin/admin.mysql.repository";
import { ICategoryRepository } from "../../domain/interfaces/repositories/category/ICategoryRepository";
import { CategoryMysqlRepository } from "../../infrastructure/database/repositories/mysql/category/category.mysql.Repository";
import { ChatMysqlRepository } from "../../infrastructure/database/repositories/mysql/Chat.mysql.Repository";
import { IChatRepository } from "../../domain/interfaces/repositories/IChatRepository";
import { CityMysqlRepository } from "../../infrastructure/database/repositories/mysql/city/city.mysql.Repository";
import { ICityRepository } from "../../domain/interfaces/repositories/city/ICityRepository";
import { MedicalRecordMysqlRepository } from "../../infrastructure/database/repositories/mysql/medical-record/medicalRecord.mysql.Repository";
import { IMedicalRecordRepository } from "../../domain/interfaces/repositories/medical-record/IMedicalRecordRepository";
import { IOtpRepository } from "../../domain/interfaces/repositories/IOtpRepository";
import { OtpMysqlRepository } from "../../infrastructure/database/repositories/mysql/otp.mysql.Repository";
import { IRateRepository } from "../../domain/interfaces/repositories/IRateRepository";
import { RateMysqlRepository } from "../../infrastructure/database/repositories/mysql/Rate.mysql.Repository";
import { IRegistrationRepository } from "../../domain/interfaces/repositories/registration/IRegistration.repository";
import { RegistrationMysqlRepository } from "../../infrastructure/database/repositories/mysql/registration/registration.mysql.Repository";
import { IUserProfileRepository } from "../../domain/interfaces/repositories/IUserProfileRepository";
import { ISpecialistProfileRepository } from "../../domain/interfaces/repositories/specs/IProfile.Repository";
import { PatientProfileMysqlRepository } from "../../infrastructure/database/repositories/mysql/UserProfile.mysql.Repository";
import { SpecialistProfileMysqlRepository } from "../../infrastructure/database/repositories/mysql/specs/specProfile.mysql.repository";
import { IWithdrawRepository } from "../../domain/interfaces/repositories/withdraw/IWithdrawRepository";
import { WithdrawMysqlRepository } from "../../infrastructure/database/repositories/mysql/withdraw/Withdraw.mysql.Repository";
import { ICertificateRepository } from "../../domain/interfaces/repositories/certifications/ICertificatesRepository";
import { CertificateMysqlRepository } from "../../infrastructure/database/repositories/mysql/certifications/certificate.mysql.repository";
import { ISessionInfoRepository } from "../../domain/interfaces/repositories/sessionInfo/ISessionInfo.Repository";
import { SessionInfoMysqlRepository } from "../../infrastructure/database/repositories/mysql/sessionInfo/sessionInfo.mysql.Repository";
import { IAssignmentRepository } from "../../domain/interfaces/repositories/assigment/assignmentRepository";
import { AssignmentMysqlRepository } from "../../infrastructure/database/repositories/mysql/assignment/Assignment.mysql.repository";
import { IBotScoreRepository } from "../../domain/interfaces/repositories/bot-score/IBotScoreRepository";
import { BotScoreMysqlRepository } from "../../infrastructure/database/repositories/mysql/bot-score/botScore.mysql.Repository";
import { IBlockingRepository } from "../../domain/interfaces/repositories/blockings/IblockingRepository";
import { BlockMysqlRepository } from "../../infrastructure/database/repositories/mysql/blockings/block.mysql.Repository";
import { IOAuthRepository } from "../../domain/interfaces/repositories/IOAuthRepository";
import { OAuthMysqlRepository } from "../../infrastructure/database/repositories/mysql/OAuth.mysql.Repository";
import { INotificationRepository } from "../../domain/interfaces/repositories/INotificationRepository";
import { NotificationMysqlRepository } from "../../infrastructure/database/repositories/mysql/Notification.mysql.Repository";
import { ReportMysqlRepository } from "../../infrastructure/database/repositories/mysql/report/report.mysql.Repository";
import { IReportRepository } from "../../domain/interfaces/repositories/report/IReportRepository";

// Register repositories

/************************** Appointment *******************************/
container.register<IAppointmentRepository>("IAppointmentRepository", {
  useClass: AppointmentMysqlRepository,
});
container.register<IAppointmentRequestRepository>(
  "IAppointmentRequestRepository",
  {
    useClass: AppointmentRequestMysqlRepository,
  },
);
container.register<IAppointmentCancellationRepository>(
  "IAppointmentCancellationRepository",
  {
    useClass: AppointmentCancellationMysqlRepository,
  },
);

/************************** admin *******************************/
container.register<IAdminRepository>("IAdminRepository", {
  useClass: AdminMysqlRepository,
});

/***************************Assignment******************************/

container.register<IAssignmentRepository>("IAssignmentRepository", {
  useClass: AssignmentMysqlRepository,
});
/************************** Category *******************************/
container.register<ICategoryRepository>("ICategoryRepository", {
  useClass: CategoryMysqlRepository,
});

/************************** Certificate *******************************/
container.register<ICertificateRepository>("ICertificateRepository", {
  useClass: CertificateMysqlRepository,
});

/************************** Chat *******************************/
container.register<IChatRepository>("IChatRepository", {
  useClass: ChatMysqlRepository,
});

/************************** City *******************************/
container.register<ICityRepository>("ICityRepository", {
  useClass: CityMysqlRepository,
});

/************************** Clinic *******************************/
container.register<IClinicRepository>("IClinicRepository", {
  useClass: ClinicMysqlRepository,
});

/************************** code *******************************/
container.register<ICodeRepository>("ICodeRepository", {
  useClass: CodeMysqlRepository,
});

/************************** MedicalRecord *******************************/
container.register<IMedicalRecordRepository>("IMedicalRecordRepository", {
  useClass: MedicalRecordMysqlRepository,
});

/************************** Notification *******************************/
container.register<INotificationRepository>("INotificationRepository", {
  useClass: NotificationMysqlRepository,
});


/************************** oAuth *******************************/
container.register<IOAuthRepository>("IOAuthRepository", {
  useClass: OAuthMysqlRepository,
});

/************************** otp *******************************/
container.register<IOtpRepository>("IOtpRepository", {
  useClass: OtpMysqlRepository,
});

/************************** rate *******************************/
container.register<IRateRepository>("IRateRepository", {
  useClass: RateMysqlRepository,
});

/************************** RedeemTransaction *******************************/
container.register<IRedeemTransactionRepository>(
  "IRedeemTransactionRepository",
  {
    useClass: RedeemTransactionMysqlRepository,
  },
);

/************************** Registration *******************************/
container.register<IRegistrationRepository>("IRegistrationRepository", {
  useClass: RegistrationMysqlRepository,
});

/************************** sessionInfo *******************************/
container.register<ISessionInfoRepository>("ISessionInfoRepository", {
  useClass: SessionInfoMysqlRepository,
});

/************************** Specialist *******************************/
container.register<ISpecialistProfileRepository>(
  "ISpecialistProfileRepository",
  {
    useClass: SpecialistProfileMysqlRepository,
  },
);
container.register<ISpecialistRepository>("ISpecialistRepository", {
  useClass: SpecialistMysqlRepository,
});

/************************** Transaction *******************************/
container.register<ITransactionRepository>("ITransactionRepository", {
  useClass: TransactionMysqlRepository,
});

/************************** Withdraw *******************************/
container.register<IWithdrawRepository>("IWithdrawRepository", {
  useClass: WithdrawMysqlRepository,
});

/************************** User *******************************/
container.register<IUserRepository>("IUserRepository", {
  useClass: UserMysqlRepository,
});
container.register<IUserProfileRepository>("IUserProfileRepository", {
  useClass: PatientProfileMysqlRepository,
});

/************************** wallet *******************************/
container.register<IWalletRepository>("IWalletRepository", {
  useClass: WalletMysqlRepository,
});

/************************** BotScore *******************************/
container.register<IBotScoreRepository>("IBotScoreRepository", {
  useClass: BotScoreMysqlRepository,
});

/************************** Block *******************************/
container.register<IBlockingRepository>("IBlockingRepository", {
  useClass: BlockMysqlRepository,
});


/************************** Report *******************************/
container.register<IReportRepository>("IReportRepository", {
  useClass:ReportMysqlRepository,
});

export { container as repositoryContainer };
