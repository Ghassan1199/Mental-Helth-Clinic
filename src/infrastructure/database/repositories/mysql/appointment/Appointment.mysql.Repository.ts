import { connectToDatabase } from "../../..";
import { DataSource, EntityManager, LessThan, MoreThan, MoreThanOrEqual, Not } from "typeorm";
import { User } from "../../../../../domain/entities/User";
import { AppointmentRequest } from "../../../../../domain/entities/AppointmentRequest";
import { IAppointmentRepository } from "../../../../../domain/interfaces/repositories/appointment/IAppointmentRepository";
import { Appointment } from "../../../../../domain/entities/Appointment";
import { Between } from "typeorm";
export class AppointmentMysqlRepository implements IAppointmentRepository {
  private client!: DataSource;

  constructor() {
    this.init();
  }
  async findNotComleteBySpecAndUser(specialist: User, user: User): Promise<Appointment[]> {
    const repository = this.client.getRepository(Appointment);
    const appointments = await repository.find({
      where: { specialistId: specialist.id, userId: user.id, isCancelled: false, isCompleted: false },
      relations:["specialist", "user"]
    });
    return appointments;
  }


  async findComleteBySpecAndUser(specialist: User, user: User): Promise<Appointment | null> {
    const repository = this.client.getRepository(Appointment);
    const appointment = await repository.findOne({
      where: { specialistId: specialist.id, userId: user.id, isCancelled: false, isCompleted: true },
    });
    return appointment;
  }

  private async init() {
    this.client = await connectToDatabase();
  }

  async create(
    appointmentRequest: AppointmentRequest,
    date: Date,
    price: string,
    entityManager?: EntityManager
  ): Promise<Appointment> {

    if (entityManager)
      return entityManager.save(Appointment, {
        specialist: appointmentRequest.specialist,
        user: appointmentRequest.user,
        date: date,
        price
      });

    const repository = this.client.getRepository(Appointment);
    const record = repository.create({
      specialist: appointmentRequest.specialist,
      user: appointmentRequest.user,
      date: date,
    });

    const savedAppointment = await repository.save(record);

    return savedAppointment;
  }

  async findById(id: number): Promise<Appointment | null> {
    const repository = this.client.getRepository(Appointment);
    const appointment = await repository.findOne({
      where: { id: id },
      relations: ["specialist", "user"],
    });
    return appointment;
  }

  async findByUser(user: User): Promise<Appointment[]> {
    const repository = this.client.getRepository(Appointment);
    const appointments = await repository.find({
      where: { user: user },
      relations: ["user", "specialist","specialist.specialistProfile"],
    });
    return appointments;
  }

  async findBySpecialist(specialist: User): Promise<Appointment[]> {
    const repository = this.client.getRepository(Appointment);
    const currentTime = new Date(Date.now() - 25 * 60 * 1000);
    const appointments = await repository.find({
      where: { specialistId: specialist.id, isCancelled: false , isCompleted: false  ,date:MoreThanOrEqual(currentTime)  },
      relations: ["user", "specialist", "specialist.specialistProfile", "user.userProfile"],
      order:{
        date : "DESC"
      }
    });
    return appointments;
  }

  async findNotComleteBySpec(specialist: User): Promise<Appointment[]> {
    const repository = this.client.getRepository(Appointment);
    const appointments = await repository.find({
      where: { specialistId: specialist.id, isCancelled: false, isCompleted: false },
    });
    return appointments;
  }

  async findComleteBySpec(specialist: User): Promise<Appointment[]> {
    const repository = this.client.getRepository(Appointment);
    const appointments = await repository.find({
      where: { specialistId: specialist.id, isCancelled: false, isCompleted: true },
      relations: ["user", "user.userProfile"],

    });
    return appointments;  
  }

  async update(appointment: Appointment): Promise<Appointment | null> {
    const repository = this.client.getRepository(Appointment);
    return await repository.save(appointment);
  }

  async checkDate(date: Date): Promise<boolean> {
    const repository = this.client.getRepository(Appointment);
  
    // Define the start date and end date for the range you want to check
  // Calculate the start date and end date
  const startDate = new Date(date.getTime() - 30 * 60 * 1000); // 30 minutes before the given date
  const endDate = new Date(date.getTime() + 30 * 60 * 1000);   // 30 minutes after the given date
  
    // Query to check if the given date falls within the specified range
    const appointments = await repository.find({
      where: {
        date: Between(startDate, endDate),
        isCancelled: false,
        isCompleted: false
      }
    });
  
    // Check if there are any appointments within the specified range
    if (appointments.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  async getAppointments(criteria: any): Promise<Appointment[]> {
    const repository = this.client.getRepository(Appointment);
    const appointments = await repository.find({
      where: criteria,
      relations: ["user", "specialist"],
    });
    return appointments;
  }


  async findByUserCount(user: User): Promise<number> {
    const repository = this.client.getRepository(Appointment);
    const appointments = await repository.count({
      where: { userId: user.id, isCompleted: false }
    });
    return appointments; 
   }

   async findBySpecAndUserCount(specialist: User, user: User): Promise<Appointment[]> {
    const repository = this.client.getRepository(Appointment);
    const appointments = await repository.find({
      where: { specialistId: specialist.id, userId: user.id, isCompleted: false }
    });
    return appointments; 
   }

}
