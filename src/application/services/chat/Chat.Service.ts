import { User } from "../../../domain/entities/User";
import { Chat } from "../../../domain/entities/Chat";
import { IChatRepository } from "../../../domain/interfaces/repositories/IChatRepository";
import StatusError from "../../utils/error";
import { inject, injectable } from "tsyringe";
import { EntityManager } from "typeorm";
import { generateRtcToken } from "./RTC.Service";
import { NotificationService } from "../Notification.Service";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
@injectable()
export class ChatService {
  private     chatRepository!: IChatRepository;
private notificationService!: NotificationService;
private userRepository!: IUserRepository;
  constructor(@inject("IChatRepository") chatRepository: IChatRepository, @inject(NotificationService) notificationService: NotificationService, @inject("IUserRepository") userRepository: IUserRepository) {
    this.chatRepository = chatRepository;
    this.notificationService = notificationService;
    this.userRepository = userRepository;
  }

  async create(
    patient: User,
    specialist: User,
    entityManager?: EntityManager
  ): Promise<Chat> {
    const chat = await this.chatRepository.findByBoth(patient, specialist);
    if (chat) return chat;
    return await this.chatRepository.create(patient, specialist, entityManager);
  }

  async index(user: User): Promise<Chat[]> {
    const chats = await this.chatRepository.findByPatient(user);
    return chats!;
  }

  async getById(id: any): Promise<Chat> {
    const chat = await this.chatRepository.findById(id);
    if (!chat) {
      throw new StatusError(404, "chat not found .");
    }
    return chat!;
  }

  async getChat(patient: User, specialist: User) {
    const chat = await this.chatRepository.findByBoth(patient, specialist);
    if (!chat) throw new StatusError(404, "Chat not found");
    const token = await generateRtcToken(chat.channelName);

    return { channelName: chat.channelName, token };
  }

    async checkChat(patient: User, specialist: User) {
    const chat = await this.chatRepository.findByBothNotBlocked(patient, specialist);
    return chat;  
  }

  async update(chat: Chat, entityManager?: EntityManager): Promise<any> {
    await this.chatRepository.update(chat, entityManager);
  }

  async delete(
    patient: User,
    specialist: User,
    entityManager?: EntityManager
  ): Promise<void> {
    await this.chatRepository.delete(patient, specialist, entityManager);
  }

  async sendNotification(type: string, userId: number, senderName: string) {
    if(!type || !userId || !senderName) throw new StatusError(400, "All fields are required");
    const user = await this.userRepository.findById(userId);
    if (!user) throw new StatusError(404, "User not found");
    if (type === "message") {
      await this.notificationService.create("12", "message", "You have a new message from "+senderName, user);
    }else{
      await this.notificationService.create("13", "video call", "You have a new video call from "+senderName, user);
    }
  }
}
