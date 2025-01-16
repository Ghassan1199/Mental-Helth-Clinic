import { EntityManager } from "typeorm";
import { Chat } from "../../entities/Chat";
import { User } from "../../entities/User";

export interface IChatRepository {
  create(patient: User, specialist: User, entityManager?: EntityManager): Promise<Chat>;
  findById(chatId: any): Promise<Chat | null>;
  findByPatient(patient: User): Promise<Chat[] | null>;
  findBySpecialist(specialist: User): Promise<Chat[] | null>;
  findByBoth(patient: User, specialist: User): Promise<Chat | null>
  findAll(): Promise<Chat[]>;
  remove(chat: Chat): Promise<any>;
  update(record: Chat, entityManager?: EntityManager): Promise<any>;
  delete(patient: User, specialist: User, entityManager?: EntityManager): Promise<void>;
  findByBothNotBlocked(patient: User, specialist: User): Promise<Chat | null> ;

}
