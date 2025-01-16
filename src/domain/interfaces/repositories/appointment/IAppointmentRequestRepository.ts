import { User } from "../../../entities/User";
import { Clinic } from "../../../entities/Clinic";
import { Appointment } from "../../../entities/Appointment";
import { AppointmentRequest } from "../../../entities/AppointmentRequest";
import { EntityManager } from "typeorm";

export interface IAppointmentRequestRepository {
  create(
    doctor: User,
    user: User,
    description: string,
  ): Promise<AppointmentRequest>;
  fullCreate(
    specialist: User,
    userId: number,
    description: string,
    proposedDate: Date,
  ): Promise<AppointmentRequest>;
  findById(id: number): Promise<AppointmentRequest | null>;
  findByUser(user: User): Promise<AppointmentRequest[] | null>;
  findBySpecialist(specialist: User): Promise<AppointmentRequest[] | null>;
  findBySpecAndUser(specialist: User, user: User): Promise<AppointmentRequest[]>;
  update(
    appointmentRequest: AppointmentRequest,
    entityManager?: EntityManager
  ): Promise<AppointmentRequest | null>;
  remove(appointmentRequest: AppointmentRequest): Promise<any>;

 findByUserCount(user: User): Promise<number>;

 findBySpecAndUserCount(specialist: User, user: User): Promise<AppointmentRequest[]>;


}

