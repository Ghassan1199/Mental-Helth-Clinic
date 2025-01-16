import { connectToDatabase } from "../../..";
import { DataSource, EntityManager, IsNull, Not, Or } from "typeorm";
import { User } from "../../../../../domain/entities/User";
import { IAppointmentRequestRepository } from "../../../../../domain/interfaces/repositories/appointment/IAppointmentRequestRepository";
import { AppointmentRequest } from "../../../../../domain/entities/AppointmentRequest";
import { Appointment } from "../../../../../domain/entities/Appointment";

export class AppointmentRequestMysqlRepository
  implements IAppointmentRequestRepository
{
  private client!: DataSource;

  constructor() {
    this.init();
  }
  async findBySpecAndUser(specialist: User, user: User): Promise<AppointmentRequest[]> {
    const repository = this.client.getRepository(AppointmentRequest);
    const appointmentRequests = await repository.find({
      where: { specialistId: specialist.id, userId: user.id, patientApprove: IsNull(), status: Or(Not(false), IsNull()) },
      relations: ["specialist", "user", "user.userProfile", "specialist.specialistProfile"],
    });
    return appointmentRequests; 
   }

   async findByUserCount(user: User): Promise<number> {
    const repository = this.client.getRepository(AppointmentRequest);
    const appointmentRequests = await repository.count({
      where: { userId: user.id, patientApprove: IsNull() ,  status: Or(Not(false), IsNull())}
    });
    return appointmentRequests; 
   }

   async findBySpecAndUserCount(specialist: User, user: User): Promise<AppointmentRequest[]> {
    const repository = this.client.getRepository(AppointmentRequest);
    const appointmentRequests = await repository.find({
      where: { specialistId: specialist.id, userId: user.id, patientApprove: IsNull() , status: Or(Not(false), IsNull())}
    });
    return appointmentRequests; 
   }

  private async init() {
    this.client = await connectToDatabase();
  }

  async fullCreate(
    specialist: User,
    userId: number,
    description: string,
    proposedDate: Date,
  ): Promise<AppointmentRequest> {
    const repo = this.client.getRepository(AppointmentRequest);
    const record = repo.create({
      specialist,
      userId,
      description,
      proposedDate,
      status: true,
    });

    return await repo.save(record);
  }
  async create(
    specialist: User,
    user: User,
    description: string,
  ): Promise<AppointmentRequest> {
    const repository = this.client.getRepository(AppointmentRequest);
    const record = repository.create({
      specialist: specialist,
      user: user,
      description: description,
    });
    const savedAppointmentRequest = await repository.save(record);
    return savedAppointmentRequest;
  }

  async findById(id: number): Promise<AppointmentRequest | null> {
    const repository = this.client.getRepository(AppointmentRequest);
    const appointmentRequest = await repository.findOne({
      where: { id: id },
      relations: ["specialist", "specialist.wallet", "user", "user.wallet", "user.userProfile", "specialist.specialistProfile"],
    });
    return appointmentRequest;
  }

  async findByUser(user: User): Promise<AppointmentRequest[] | null> {
    const repository = this.client.getRepository(AppointmentRequest);
    const appointmentRequests = await repository.find({
      where: { userId: user.id },
      relations: ["specialist", "user", "user.userProfile","specialist.specialistProfile"],
    });

    return appointmentRequests || null;
  }

  async findBySpecialist(
    specialist: User,
  ): Promise<AppointmentRequest[] | null> {
    const repository = this.client.getRepository(AppointmentRequest);
    const appointmentRequests = await repository.find({
      where: { specialistId: specialist.id, patientApprove: IsNull(), status: Or(Not(false), IsNull()) },
      relations: ["specialist", "user", "user.userProfile", "specialist.specialistProfile"],
    });
    return appointmentRequests || null;
  }

  async update(
    appointmentRequest: AppointmentRequest,entityManager: EntityManager
  ): Promise<AppointmentRequest | null> {
    if(entityManager) return await entityManager.save(AppointmentRequest, appointmentRequest);
    const repository = this.client.getRepository(AppointmentRequest);
    return await repository.save(appointmentRequest);
  }

  async remove(appointmentRequest: AppointmentRequest): Promise<any> {
    const repository = this.client.getRepository(AppointmentRequest);
    await repository.delete(appointmentRequest.id);
    return true;
  }

}
