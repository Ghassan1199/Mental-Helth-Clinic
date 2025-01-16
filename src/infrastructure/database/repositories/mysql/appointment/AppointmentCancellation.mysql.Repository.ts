import { connectToDatabase } from "../../..";
import { DataSource, EntityManager } from "typeorm";
import { IAppointmentCancellationRepository } from "../../../../../domain/interfaces/repositories/appointment/IAppointmentCancellationRepository";
import { Appointment } from "../../../../../domain/entities/Appointment";
import { AppointmentCancellation } from "../../../../../domain/entities/AppointmentCancellation";

export class AppointmentCancellationMysqlRepository
    implements IAppointmentCancellationRepository
{
    private client!: DataSource;

    constructor() {
        this.init();
    }

    private async init() {
        this.client = await connectToDatabase();
    }

    async create(
        appointment: Appointment,
        cancelledBy: boolean,
        description: string
    ): Promise<AppointmentCancellation> {
        const repository = this.client.getRepository(AppointmentCancellation);
        const record = repository.create({
            appointment: appointment,
            cancelledBy: cancelledBy,
            description: description,
        });
        const savedAppointmentCancellation = await repository.save(record);
        return savedAppointmentCancellation;
    }

    async findById(id: number): Promise<AppointmentCancellation | null> {
        const repository = this.client.getRepository(AppointmentCancellation);
        const appointmentCancellation = await repository.findOneBy({ id: id });
        return appointmentCancellation;
    }
}
