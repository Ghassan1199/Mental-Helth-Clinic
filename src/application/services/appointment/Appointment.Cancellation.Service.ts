import { inject, injectable } from "tsyringe";
import { Appointment } from "../../../domain/entities/Appointment";
import { AppointmentCancellation } from "../../../domain/entities/AppointmentCancellation";
import { User } from "../../../domain/entities/User";
import { IAppointmentCancellationRepository } from "../../../domain/interfaces/repositories/appointment/IAppointmentCancellationRepository";
import { IAppointmentRepository } from "../../../domain/interfaces/repositories/appointment/IAppointmentRepository";
import { connectToDatabase } from "../../../infrastructure/database";
import StatusError from "../../utils/error";
import { NotificationService } from "../Notification.Service";
import { SessionInfoService } from "../sessionInfo/SessionInfo.Service";
import { WalletService } from "../Wallet.Service";
import { IWalletRepository } from "../../../domain/interfaces/repositories/IWalletRepository";
@injectable()
export class AppointmentCancellationService {
  private appointmentCancellationRepository!: IAppointmentCancellationRepository;
  private appointmentRepository!: IAppointmentRepository;
  private notificationService!: NotificationService;
  private sessionInfoService!: SessionInfoService;
  private walletService!: WalletService;
  private walletRepository!: IWalletRepository;
  constructor(
    @inject("IAppointmentCancellationRepository")
    appointmentCancellationRepository: IAppointmentCancellationRepository,
    @inject("IAppointmentRepository")
    appointmentRepository: IAppointmentRepository,
    @inject(NotificationService)
    notificationService: NotificationService,
    @inject(SessionInfoService)
    sessionInfoService: SessionInfoService,
      @inject(WalletService)
      walletService: WalletService,
      @inject("IWalletRepository")
      walletRepository: IWalletRepository
  ) {
    this.appointmentCancellationRepository = appointmentCancellationRepository;
    this.appointmentRepository = appointmentRepository;
    this.notificationService = notificationService;
    this.sessionInfoService = sessionInfoService;
    this.walletService = walletService;
    this.walletRepository = walletRepository;

  }

  async create(
    user: User,
    appointment: Appointment,
    description: string
  ): Promise<AppointmentCancellation | any> {
    let cancelledBy;
    const userWallet = await this.walletService.getByUser(appointment.user);
    const SpecialistWallet = await this.walletService.getByUser(appointment.specialist);

    if (appointment.isCancelled) {
      throw new StatusError(400, "Appointment is already cancelled");
    }
    if (appointment.isCompleted) {
      throw new StatusError(400, "Appointment is already completed");
    }
    const now = new Date();
        const currentTime = new Date(now.getTime() + 1000 * 60 * 60 * 3);
    const appointmentTime = new Date(appointment.date as any);


    // Check if the appointment is within 2 hours
    if ((appointmentTime.getTime() - currentTime.getTime()) <= 2 * 60 * 60 * 1000) {
      throw new StatusError(400, "Cannot cancel appointment within 2 hours of its start time");
    }

  
    if (user.id == appointment.user.id && user.roleId == 0) {
      cancelledBy = false;
    } else if (user.id == appointment.specialist.id && user.roleId != 0) {
      cancelledBy = true;
    } else {
      throw new StatusError(401, "You are not the owner of the appointment");
    }
    appointment.isCancelled = true;
    userWallet.balance += Number(appointment.price); 
    SpecialistWallet.balance -= Number(appointment.price); 

    await (
      await connectToDatabase()
    ).transaction(async (transactionalEntityManager) => {
      const appointmentCancellation =
        await this.appointmentCancellationRepository.create(
          appointment,
          cancelledBy,
          description
        );

      (await this.appointmentRepository.update(appointment)) as any;


      await this.walletRepository.update(userWallet, transactionalEntityManager);
      await this.walletRepository.update(SpecialistWallet, transactionalEntityManager);
      return appointmentCancellation;
    });

    if(cancelledBy){
      await this.notificationService.create("2","appointment cancelled", `appointment is cancelled`, appointment.user);

    }else{
      await this.notificationService.create("2","appointment cancelled", `appointment is cancelled`, appointment.specialist);
    }

  }
  }
