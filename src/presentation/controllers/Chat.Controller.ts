import { Response, Request, NextFunction } from "express";
import { ClinicService } from "../../application/services/Clinic.Service";
import AuthenticatedRequest from "../../domain/interfaces/utils/AuthenticatedRequest";
import { ChatService } from "../../application/services/chat/Chat.Service";
import { UserService } from "../../application/services/patient/Patient.auth.Service";
import { UserMysqlRepository } from "../../infrastructure/database/repositories/mysql/user.mysql.Repository";
import ChatResource from "../resources/ChatResource";
import { inject, injectable } from "tsyringe";
import StatusError from "../../application/utils/error";
import { successfulResponse } from "../../application/utils/responseMessage";
import dotenv from "dotenv";
import { IAppointmentRepository } from "../../domain/interfaces/repositories/appointment/IAppointmentRepository";
import { AppointmentMysqlRepository } from "../../infrastructure/database/repositories/mysql/appointment/Appointment.mysql.Repository";
dotenv.config();
@injectable()
export class ChatController {
  private chatService: ChatService;
  private userService: UserService;
  private appointmentRepository: IAppointmentRepository;


  constructor(
    @inject(ChatService) chatService: ChatService,
    @inject(UserService) userService: UserService
  ) {
    this.chatService = chatService;
    this.userService = userService;
    this.appointmentRepository = new AppointmentMysqlRepository();
  }

  async index(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const chats = await this.chatService.index(req.auth!.user);
      return res.status(201).json({
        success: true,
        message: "chats returned successfully",
        data: await new ChatResource().init(chats)
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal server error";
      console.error(error);
      return res.status(statusCode).json({
        success: false,
        message: message,
      });
    }
  }

  async create(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const user = req.auth?.user;
      const { specialistId } = req.body;
      const specialist = await this.userService.getUser(specialistId);
      const docs = await this.chatService.create(user!, specialist!);

      return res.status(201).json({
        success: true,
        message: "doctors returned successfully",
        data: await new ChatResource().init(docs),
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal server error";
      console.error(error);
      return res.status(statusCode).json({
        success: false,
        message: message,
      });
    }
  }


  async getChat(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.auth!.user;
      const { userId } = req.params;
      const {appointmentId} = req.query;
      const user2 = await this.userService.getUser(Number(userId));
      if(!user2) throw new StatusError(404, "User Not found.");

        if (appointmentId != undefined) {
          const appo = await this.appointmentRepository.findById(Number(appointmentId));
        
          if (!appo) {
            throw new StatusError(404, "Appointment not found.");
          }
        
          if (appo. isCancelled || appo.isCompleted) {
            throw new StatusError(403, "You cannot access this appointment.");
          }
        
          const appointmentDate = new Date(appo.date.toString());             
        
          const sessionEndTime = new Date(appointmentDate.getTime() + 30 * 60 * 1000);
          const now = new Date();
        
          if (now > sessionEndTime) {
            throw new StatusError(403, "The appointment date is no longer valid.");
          }
        }
      
      
      let chat;
      if(user.roleId == Number(process.env.USER_ROLE)){
        chat = await this.chatService.getChat(user, user2);
      }else{
        chat = await this.chatService.getChat(user2, user);
      }

      return res.status(200).json(successfulResponse("Chat",  chat));
    } catch (error: any) {
     next(error);
  }}


  async sendMessage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { userId, senderName, type } = req.body;
      await this.chatService.sendNotification(type, userId, senderName);

      return res.status(201).json(successfulResponse("Message notification sent successfully"));
    } catch (error: any) {
     next(error);
    }
  }

}

  
