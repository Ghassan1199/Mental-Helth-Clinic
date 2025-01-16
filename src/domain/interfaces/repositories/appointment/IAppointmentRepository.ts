import { EntityManager } from "typeorm";
import { AppointmentRequest } from "../../../entities/AppointmentRequest";
import { User } from "../../../entities/User";
import { Appointment } from "../../../entities/Appointment";

export interface IAppointmentRepository {
  create(
    appointmentRequest: AppointmentRequest,
    date: Date,
    price: string,
    entityManager?: EntityManager
  ): Promise<Appointment>;
  findById(id: number): Promise<Appointment | null>;
  findByUser(user: User): Promise<Appointment[]>;
  findBySpecialist(specialist: User): Promise<Appointment[]>;
  findNotComleteBySpec(specialist: User): Promise<Appointment[]>;
      findComleteBySpec(specialist: User): Promise<Appointment[]>;
  findNotComleteBySpecAndUser(specialist: User, user: User): Promise<Appointment[]>;
  findComleteBySpecAndUser(specialist: User, user: User): Promise<Appointment | null>;
  update(appointment: Appointment): Promise<Appointment | null>;
 checkDate(date: Date): Promise<boolean>;
 getAppointments(criteria: any): Promise<Appointment[]>;  
 findByUserCount(user: User): Promise<number>;
 findBySpecAndUserCount(specialist: User, user: User): Promise<Appointment[]>;
}
