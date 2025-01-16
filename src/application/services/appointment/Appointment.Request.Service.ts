import { Console } from "console";
import { AppointmentRequest } from "../../../domain/entities/AppointmentRequest";
import { Clinic } from "../../../domain/entities/Clinic";
import { User } from "../../../domain/entities/User";
import { IAppointmentRequestRepository } from "../../../domain/interfaces/repositories/appointment/IAppointmentRequestRepository";
import { connectToDatabase } from "../../../infrastructure/database";
import StatusError from "../../utils/error";
import { TransactionService } from "../Transaction.Service";
import { WalletService } from "../Wallet.Service";
import { CodeService } from "../codes/Code.Service";
import { AppointmentService } from "./Appointment.Service";
import { inject, injectable } from "tsyringe";
import { IAppointmentRepository } from "../../../domain/interfaces/repositories/appointment/IAppointmentRepository";
import BlockedValidator from "../../validation/isBlocked";
import { NotificationService } from "../Notification.Service";
import { UserService } from "../patient/Patient.auth.Service";
import { SessionInfoService } from "../sessionInfo/SessionInfo.Service";
require("dotenv").config();

@injectable()
export class AppointmentRequestService {
  private appointmentRequestRepository!: IAppointmentRequestRepository;
  private appointmentService!: AppointmentService;
  private walletService!: WalletService;
  private transactionService!: TransactionService;
  private appointmentRepository!: IAppointmentRepository;
  private blockValidator!: BlockedValidator;
  private notificationService!: NotificationService;
  private userService!: UserService;
  private sessionInfoService!: SessionInfoService;



  constructor(
    @inject("IAppointmentRequestRepository")
    appointmentRequestRepository: IAppointmentRequestRepository,
    @inject("IAppointmentRepository")
    appointmentRepository: IAppointmentRepository,
    @inject(AppointmentService)
    appointmentService: AppointmentService,
    @inject(WalletService)
    walletService: WalletService,
    @inject(TransactionService)
    transactionService: TransactionService,
    @inject(BlockedValidator)
    blockValidator: BlockedValidator,
    @inject(NotificationService)
    notificationService: NotificationService,
    @inject(UserService)
    userService: UserService,
    @inject(SessionInfoService)
    sessionInfoService: SessionInfoService,
  ) {
    this.appointmentRequestRepository = appointmentRequestRepository;
    this.appointmentService = appointmentService;
    this.walletService = walletService;
    this.transactionService = transactionService;
    this.appointmentRepository = appointmentRepository;
    this.blockValidator = blockValidator;
    this.notificationService = notificationService;
    this.userService = userService;
    this.sessionInfoService = sessionInfoService;
  }

  async create(
    specialist: User,
    user: User,
    description: string
  ): Promise<AppointmentRequest> {
    await this.blockValidator.checkBlock(specialist.id, user.id);


    const prevReqs = await this.appointmentRequestRepository.findBySpecAndUserCount(specialist, user);
    const prevAppos = await this.appointmentRepository.findBySpecAndUserCount(specialist, user);

    if(prevReqs.length + prevAppos.length > 0) throw new StatusError(400, "You can not have more than one appointment with this doctor.");
    
    const reqsCount = await this.appointmentRequestRepository.findByUserCount(user);
    const apposCount = await this.appointmentRepository.findByUserCount(user);

    if(reqsCount + apposCount > 1) throw new StatusError(400, "You can not have more than 2 appointments at the same time.");
        
      
    const userWallet = await this.walletService.getByUser(user);

    const sessionInfo = await this.sessionInfoService.getSessionInfo();
    if (userWallet.balance < sessionInfo[0].price) throw new StatusError(400, "Insufficient funds in source wallet");

    const appointmentRequest = await this.appointmentRequestRepository.create(
      specialist,   
      user,
      description
    );
    await this.notificationService.create("3","appointment request", `${user.username} sent you an appointment request`, specialist);
    return appointmentRequest;
  }

  async createByspec(
    specialist: User,
    userId: number,
    description: string,
    proposedDate: Date
  ) {
    await this.blockValidator.checkBlock(specialist.id, userId);


    const user = await this.userService.getUser(userId);

    if(!user) throw new StatusError(404, "User not founnd");

    const prevReq = await this.appointmentRequestRepository.findBySpecAndUser(specialist, user);
    if(prevReq.length == 1) throw new StatusError(400, "Wait for the previous request to be handled.");          
    const now = new Date(new Date().getTime() + 1000 * 60 * 60 * 3);

    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
    const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (new Date(proposedDate) <= fiveMinutesFromNow) {
      throw new StatusError(
        400,
        "The date must be at least 5 minutes greater than the current date."
      );
    }
    if (new Date(proposedDate) > oneMonthFromNow) {
      throw new StatusError(
        400,
        "The date must be earlier than one month from now."
      );
    }

    if (await this.appointmentRepository.checkDate(new Date(proposedDate))) {
      throw new StatusError(
        400,
        "You have appoiemnt in this range, before or after date."
      );
    }


    const req = await this.appointmentRequestRepository.fullCreate(
      specialist,
      userId,
      description,
      proposedDate
    );

    await this.notificationService.create("3","appointment request", `${specialist.username} sent you an appointment request`, user);
   
    return req;
  }


  async setDate(appointmentRequestId: any, date: Date): Promise<any> {
    const appointmentRequest = await this.appointmentRequestRepository.findById(
      appointmentRequestId
    );
    if (!appointmentRequest) {
      throw new StatusError(404, "Appointment request not found .");
    }

    await this.blockValidator.checkBlock(
      appointmentRequest.specialistId,
      appointmentRequest.userId
    );

    if (appointmentRequest.status != null) {
      throw new StatusError(
        404,
        "Appointment request has been checked before."
      );
    }

    const now = new Date(new Date().getTime() + 1000 * 60 * 60 * 3);
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
    const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (new Date(date) <= fiveMinutesFromNow) {
      throw new StatusError(
        400,
        "The date must be at least 5 minutes greater than the current date."
      );
    }
    if (new Date(date) >= oneMonthFromNow) {
      throw new StatusError(
        400,
        "The date must be earlier than one month from now."
      );
    }

    if (await this.appointmentRepository.checkDate(new Date(date))) {
      throw new StatusError(
        400,
        "You have appoiemnt in this range, before or after date."
      );
    }

    appointmentRequest.status = true;
    appointmentRequest.proposedDate = date;

    await this.appointmentRequestRepository.update(appointmentRequest);

    await this.notificationService.create("4","appointment time has been set", `appointment time is set to ${date} `, appointmentRequest.user);

  }

  async reject(appointmentRequestId: any): Promise<any> {
    const appointmentRequest = await this.appointmentRequestRepository.findById(
      appointmentRequestId
    );
    if (!appointmentRequest) {
      throw new StatusError(404, "Appointment request not found .");
    }
    if (
      appointmentRequest.patientApprove != null ||
      appointmentRequest.status == false
    ) {
      throw new StatusError(
        404,
        "Appointment request has been checked before Or rejected."
      );
    }
    appointmentRequest.status = false;
    await this.appointmentRequestRepository.update(appointmentRequest);
 
    await this.notificationService.create("5","appointment rejected", `appointment request is rejected by therapist `, appointmentRequest.user);

 
  }

  async accept(appointmentRequestId: any): Promise<any> {

    const sessionInfo = await this.sessionInfoService.getSessionInfo();
    const appointmentRequest = await this.appointmentRequestRepository.findById(
      appointmentRequestId
    );
    if (!appointmentRequest) {
      throw new StatusError(404, "Appointment request not found .");
    }
    await this.blockValidator.checkBlock(
      appointmentRequest.specialistId,
      appointmentRequest.userId );

      if(appointmentRequest.proposedDate == null) throw new StatusError(400, "Wait until the doctor set a date.");

    if (
      await this.appointmentRepository.checkDate(
        new Date(appointmentRequest.proposedDate)
      )
    ) {
      throw new StatusError(400, "there is an appiontment in this time.");
    }

    if (
      appointmentRequest.patientApprove != null ||
      appointmentRequest.status == false
    ) {
      throw new StatusError(404, "there is an appiontment in this time.");
    }
    appointmentRequest.patientApprove = true;
    await (
      await connectToDatabase()
    ).transaction(async (entityManager) => {
      (await this.appointmentRequestRepository.update(
        appointmentRequest, entityManager
      )) as any;

      const appointment = await this.appointmentService.create(
        appointmentRequest,
        appointmentRequest.proposedDate,
        entityManager
      );

       await this.transactionService.create(
        appointmentRequest.specialist.wallet!,
        appointmentRequest.user.wallet!,
        appointment,
        sessionInfo[0].price as any,
        entityManager
      );
    });

    await this.notificationService.create("6","appointment accepted", `appointment request is accepted by user `, appointmentRequest.specialist);

  }

  async refuse(appointmentRequestId: any): Promise<any> {
    const appointmentRequest = await this.appointmentRequestRepository.findById(
      appointmentRequestId
    );
    if (!appointmentRequest) {
      throw new StatusError(404, "Appointment request not found .");
    }
    if (
      appointmentRequest.patientApprove != null ||
      appointmentRequest.status == false ||
      appointmentRequest.status == null
    ) {
      throw new StatusError(
        404,
        "Appointment request has been checked before Or rejected ."
      );
    }
    appointmentRequest.patientApprove = false;
    await (
      await connectToDatabase()
    ).transaction(async () => {
      (await this.appointmentRequestRepository.update(
        appointmentRequest
      )) as any;
    });

    await this.notificationService.create("5","appointment rejected", `appointment request is rejected by user `, appointmentRequest.specialist);

  }

  async getSpecialistAppointmentRequest(
    specialist: User
  ): Promise<AppointmentRequest[] | null> {
    const appointmentRequests =
      await this.appointmentRequestRepository.findBySpecialist(specialist);
    return appointmentRequests;
  }

  async getPatientAppointmentRequest(
    user: User
  ): Promise<AppointmentRequest[] | null> {
    const appointmentRequests =
      await this.appointmentRequestRepository.findByUser(user);
    return appointmentRequests;
  }

  async remove(appointmentRequestId: any): Promise<any> {
    const appointmentRequest = await this.appointmentRequestRepository.findById(
      appointmentRequestId
    );
    if (!appointmentRequest) {
      throw new StatusError(404, "Appointment request not found .");
    }
    await this.appointmentRequestRepository.remove(appointmentRequest);
  }
}
