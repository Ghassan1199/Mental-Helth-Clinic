import { connectToDatabase } from "../../";
import { DataSource, EntityManager } from "typeorm";
import { User } from "../../../../domain/entities/User";
import { IChatRepository } from "../../../../domain/interfaces/repositories/IChatRepository";
import { Chat } from "../../../../domain/entities/Chat";

export class ChatMysqlRepository implements IChatRepository {
  private client!: DataSource;

  constructor() {
    this.init();
  }
  private async init() {
    this.client = await connectToDatabase();
  }

  async create(patient: User, specialist: User, entityManager?: EntityManager): Promise<Chat> {
    const channelName = String(specialist.id) + "A" + String(patient.id);
    if(entityManager){
      const record = entityManager.create(Chat, {patient, specialist, channelName});
       return entityManager.save(record);
    }

    const repository = this.client.getRepository(Chat);
    const record = repository.create({
      patient: patient,
      specialist: specialist,
      channelName
    });

    return await repository.save(record);
  }

  async findById(id: number): Promise<Chat | null> {
    const repository = this.client.getRepository(Chat);
    const chat = await repository.findOne({
      where: { id: id , isBlocked: false},
    });
    return chat || null;
  }

  async findAll(): Promise<Chat[]> {
    const repository = this.client.getRepository(Chat);
    const chats = await repository.find();
    return chats;
  }

  async findByPatient(patient: User): Promise<Chat[] | null> {
    const repository = this.client.getRepository(Chat);
    const chats = await repository.find({
      where: { patient: patient  , isBlocked: false},
      relations: ["specialist","specialist.specialistProfile", "patient"]

    });
    return chats;
  }
  async findBySpecialist(specialist: User): Promise<Chat[] | null> {
    const repository = this.client.getRepository(Chat);
    const chats = await repository.find({
      where: { specialist: specialist , isBlocked: false},
      relations: ["specialist","specialist.specialistProfile", "patient"]
    });
    return chats;
  }
  async remove(chat: Chat): Promise<any> {
    const repository = this.client.getRepository(Chat);
    await repository.delete(chat.id);
    return true;
  }

  async findByBoth(patient: User, specialist: User): Promise<Chat | null> {

    const repository = this.client.getRepository(Chat);
    const chat = await repository.findOne({
      where: { patientId: patient.id, specialistId: specialist.id , isBlocked: false},
    });
    return chat;
  }


  async findByBothNotBlocked(patient: User, specialist: User): Promise<Chat | null> {

    const repository = this.client.getRepository(Chat);
    const chat = await repository.findOne({
      where: { patientId: patient.id, specialistId: specialist.id },
    });
    return chat;
  }
      async update(record: Chat, entityManager?: EntityManager) {
    if (!entityManager) {
      entityManager = this.client.manager;
    }   
    return await entityManager!.save(Chat, record);
  }


  async delete(patient: User, specialist: User, entityManager?: EntityManager): Promise<void> {
    if(entityManager){
      entityManager.delete(Chat, {patient, specialist});
    }

    const repository = this.client.getRepository(Chat);
    repository.delete({
      patient: patient,
      specialist: specialist,
    });

  }

}
