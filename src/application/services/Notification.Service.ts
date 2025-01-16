import { EntityManager } from "typeorm";
import { User } from "../../domain/entities/User";
import StatusError from "../utils/error";
import { inject, injectable } from "tsyringe";
import { INotificationRepository } from "../../domain/interfaces/repositories/INotificationRepository";
import { Notification } from "../../domain/entities/Notification";
import Pushy, { SendPushNotificationOptions } from "pushy";
@injectable()
export class NotificationService {
  private notificationRepository!: INotificationRepository;

  constructor(
    @inject("INotificationRepository")
    notificationRepository: INotificationRepository
  ) {
    this.notificationRepository = notificationRepository;
  }

  async create(
    type: string,
    title: string,
    content: string,
    user: User,
    entityManager?: EntityManager
  ): Promise<Notification> {
    const notification = await this.notificationRepository.create(
      title,
      content,
      user,
      entityManager
    );

    var pushyAPI = new Pushy(process.env.PUSHY_SECRET_API_KEY as string);

    // Send push notification via Pushy
    const data = {
      type:type,
      title: title,
      body: content,
 };
    const to = user.deviceToken; // Assuming user has a deviceToken property
    const options: Partial<SendPushNotificationOptions> = {
      notification: {
        badge: 1,
        sound: "ping.aiff",
        title: title,
        body: content,
        category: "",
        loc_key: "",
        loc_args: [],
        title_loc_key: "",
        title_loc_args: [],
        interruption_level: "active"
      },
  
    };
    pushyAPI.sendPushNotification(data, to, options, function (err, id) {
      if (err) {
        console.error("Pushy error:", err);
        return;
      }

      console.log("Pushy success! (ID: " + id + ")");
    });

    return notification;
  }

  async getById(id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw new StatusError(404, "notification not found .");
    }
    return notification!;
  }

  async getByUser(user: User): Promise<Notification[]> {
    const notification = await this.notificationRepository.findByUser(user);
    if (!notification) {
      throw new StatusError(404, "notification not found .");
    }
    return notification!;
  }
}
