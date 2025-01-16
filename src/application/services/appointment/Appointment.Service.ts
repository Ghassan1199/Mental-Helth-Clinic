import { inject, injectable } from "tsyringe";
import { Appointment } from "../../../domain/entities/Appointment";
import { AppointmentRequest } from "../../../domain/entities/AppointmentRequest";
import { User } from "../../../domain/entities/User";
import { IAppointmentRepository } from "../../../domain/interfaces/repositories/appointment/IAppointmentRepository";
import StatusError from "../../utils/error";
import { ChatService } from "../chat/Chat.Service";
import { connectToDatabase } from "../../../infrastructure/database";
import BlockedValidator from "../../validation/isBlocked";
import { SessionInfoService } from "../sessionInfo/SessionInfo.Service";
import env from "dotenv";
env.config();
import { EntityManager } from "typeorm";
@injectable()
export class AppointmentService {
  private appointmentRepository!: IAppointmentRepository;
  private chatService!: ChatService;
  private blockValidator!: BlockedValidator;
  private sessionInfoService!: SessionInfoService;

  constructor(
    @inject("IAppointmentRepository")
    appointmentRepository: IAppointmentRepository,
    @inject(ChatService)
    chatService: ChatService,
    @inject(BlockedValidator)
    blockValidator: BlockedValidator,
    @inject(SessionInfoService)
    sessionInfoService: SessionInfoService
  ) {
    this.appointmentRepository = appointmentRepository;
    this.chatService = chatService;
    this.blockValidator = blockValidator;
    this.sessionInfoService = sessionInfoService;
  }

  async create(
    appointmentRequest: AppointmentRequest,
    date: Date,
    entityManager? : EntityManager
  ): Promise<Appointment> {
    const sessionInfo = await this.sessionInfoService.getSessionInfo();
    await this.blockValidator.checkBlock(appointmentRequest.specialistId,appointmentRequest.userId);
    let appointment;


      

      await this.chatService.create(
        appointmentRequest.user,
        appointmentRequest.specialist,
        entityManager
      );

      appointment = await this.appointmentRepository.create(
        appointmentRequest,
        date,
        String(sessionInfo[0].price),
        entityManager
      );

   

    return appointment!;
  }

  async getById(id: any): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new StatusError(404, "appointment not found .");
    }



    return appointment;
  }

  async getUserAppointment(user: User): Promise<Appointment[]> {
    const appointments = await this.appointmentRepository.findByUser(user);
    return appointments;
  }

  async getClinicAppointment(doctor: User): Promise<Appointment[]> {
    const appointments = await this.appointmentRepository.findBySpecialist(
      doctor
    );
    return appointments;
  }

  async markAsComplete(user: User, appointmentId: number){

    const appo = await this.getById(appointmentId);
    if(user.roleId == Number(process.env.USER_ROLE) && user.id == appo.userId){
      appo.completedByUser = true;
    }else{
      appo.completedBySpec = true;
    }

    if(appo.completedBySpec && appo.completedByUser){
      appo.isCompleted = true;
    }
    await this.appointmentRepository.update(appo);
  }

  async checkAppo(appointmentId: number){

    const appo = await this.getById(appointmentId);

    return {status: appo.isCompleted}
  
  }
}
