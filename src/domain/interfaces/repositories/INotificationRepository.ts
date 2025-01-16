import { EntityManager } from "typeorm";
import { Notification } from "../../entities/Notification";
import { User } from "../../entities/User";

export interface INotificationRepository {
  create(
    title: string,
    content: string,
    user: User,
    entityManager?: EntityManager
  ): Promise<Notification>;
  findById(notificationId: any): Promise<Notification | null>;
  findByUser(user: User): Promise<Notification[] | null>;
}
