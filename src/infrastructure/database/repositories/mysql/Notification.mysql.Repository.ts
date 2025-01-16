import { connectToDatabase } from "../../";
import { DataSource, EntityManager } from "typeorm";
import { User } from "../../../../domain/entities/User";
import { INotificationRepository } from "../../../../domain/interfaces/repositories/INotificationRepository";
import { Notification } from "../../../../domain/entities/Notification";

export class NotificationMysqlRepository implements INotificationRepository {
  private client!: DataSource;

  constructor() {
    this.init();
  }
  private async init() {
    this.client = await connectToDatabase();
  }

  async create(
    title: string,
    content: string,
    user: User,
    entityManager?: EntityManager
  ): Promise<Notification> {
    if (entityManager) {
      const record = entityManager.save(Notification , {
        user: user,
        title: title,
        content: content,
      });
      return record;
     }
      const record = this.client.getRepository(Notification).save({
        user: user,
      title: title,
      content: content,
    });
    return record;
  }
  async findById(notificationId: any): Promise<Notification | null> {
    const repository = this.client.getRepository(Notification);
    const notification = await repository.findOne({
      where: { id: notificationId },
      //relations: ["specialist", "user"],
    });
      if (notification) {
          notification!.status = true;
          await repository.save(notification);
       }
    return notification;
  }
    
  async findByUser(user: User): Promise<Notification[] | null> {
    const repository = this.client.getRepository(Notification);
    const notifications = await repository.find({
      where: { user: user },
      //relations: ["user", "specialist"],
    });
    return notifications;
  }
}
