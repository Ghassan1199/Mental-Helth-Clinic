import { inject, injectable } from "tsyringe";

import Validator from "../../validation/validator";
import { UserService } from "../patient/Patient.auth.Service";
import StatusError from "../../utils/error";
import { IBlockingRepository } from "../../../domain/interfaces/repositories/blockings/IblockingRepository";
import { User } from "../../../domain/entities/User";
import { ChatService } from "../chat/Chat.Service";
import { connectToDatabase } from "../../../infrastructure/database";
import env from "dotenv";
import { IAppointmentRepository } from "../../../domain/interfaces/repositories/appointment/IAppointmentRepository";
import { IAppointmentRequestRepository } from "../../../domain/interfaces/repositories/appointment/IAppointmentRequestRepository";
import { IAppointmentCancellationRepository } from "../../../domain/interfaces/repositories/appointment/IAppointmentCancellationRepository";
import { AppointmentCancellationService } from "../appointment/Appointment.Cancellation.Service";

env.config();
@injectable()
export class BlockService {
  private validator: Validator;
  private blockRepository: IBlockingRepository;
  private userService: UserService;
  private chatService: ChatService;
  private appointmentRepo: IAppointmentRepository;
  private appointmentRequestRepo: IAppointmentRequestRepository;
  private appointmentCanellationService: AppointmentCancellationService;

  constructor(
    @inject(Validator) validator: Validator,
    @inject("IBlockingRepository") blockRepository: IBlockingRepository,
    @inject(UserService) userService: UserService,
    @inject(ChatService) chatService: ChatService,
    @inject("IAppointmentRepository") appointmentRepo: IAppointmentRepository,
    @inject("IAppointmentRequestRepository") appointmentRequestRepo: IAppointmentRequestRepository,
    @inject(AppointmentCancellationService) appointmentCanellationService: AppointmentCancellationService

  ) {
    this.validator = validator;
    this.blockRepository = blockRepository;
    this.userService = userService;
    this.chatService = chatService;
    this.appointmentRepo = appointmentRepo;
    this.appointmentRequestRepo = appointmentRequestRepo;
    this.appointmentCanellationService = appointmentCanellationService;
  }

  async createBlock(doctor: User, userId: number, blockedBy: boolean) {
    this.validator.validateRequiredFields({ userId  });

    if(doctor.id == userId) throw new StatusError(400, "You can not block your self!!");
    const user = await this.userService.getUser(userId);
    if (!user) throw new StatusError(404, " user not found");
    const appos = this.appointmentRepo.findNotComleteBySpecAndUser(doctor, user);
    const apporeqs = this.appointmentRequestRepo.findBySpecAndUser(doctor, user);

                    
    const block = await this.blockRepository.showBlockBy(doctor.id, userId, blockedBy);
    if (block != null) throw new StatusError(400, "User is already blocked");

    if (user.roleId != Number(process.env.USER_ROLE))
      throw new StatusError(400, "You can not block doctor.");
    let chat = await this.chatService.checkChat(user, doctor);

    await ( 
      await connectToDatabase()
    ).transaction(async (transactionalEntityManager) => {
      await this.blockRepository.createBlock(
        doctor.id,
        userId,
        blockedBy,
        transactionalEntityManager
      );
      if (chat) {
        chat.isBlocked = true;
        await this.chatService.update(chat, transactionalEntityManager);
      }
    });
    for(const app of await appos){
      await this.appointmentCanellationService.create(doctor, app, "block");

    }
    for(const app of await apporeqs ?? []){
      await this.appointmentRequestRepo.remove(app);
    }
  }

  async getBlocks(doctorId: number) {
    return await this.blockRepository.getBlocks(doctorId);
  }

  async getBlocksByUser(userId: number) {
    return await this.blockRepository.getBlocksByUser(userId);
  }

  async showBlock(doctorId: number, userId: number) {
    this.validator.validateRequiredFields({ doctorId, userId });
    const block = await this.blockRepository.showBlock(doctorId, userId);
    if (block == null) throw new StatusError(404, "block record not found");

    return block;
  }

  async deleteBlock(doctorId: number, userId: number, blockedBy: boolean) {

    const block = await this.blockRepository.showBlockBy(doctorId, userId, blockedBy);
    if (block == null) throw new StatusError(404, "block record not found"); 
    if (block.doctorId != doctorId) throw new StatusError(401, "unauthorized");
    const doctor = await this.userService.getUser(doctorId);
    const user = await this.userService.getUser(userId);
    let chat = await this.chatService.checkChat(user!, doctor!);

    await (
      await connectToDatabase()
    ).transaction(async (transactionalEntityManager) => {
          await this.blockRepository.deleteBlock(
            block,
            transactionalEntityManager
          );
      if (chat) {
        chat.isBlocked = false;
        await this.chatService.update(chat, transactionalEntityManager);
      }
    });
  }
}
