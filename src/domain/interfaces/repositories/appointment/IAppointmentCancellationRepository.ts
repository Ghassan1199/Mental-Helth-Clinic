import { Appointment } from "../../../entities/Appointment";
import { AppointmentCancellation } from "../../../entities/AppointmentCancellation";

export interface IAppointmentCancellationRepository {
    create(
        appointment: Appointment,
        cancelledBy: boolean,
        description: string
    ): Promise<AppointmentCancellation>;
    findById(id: number): Promise<AppointmentCancellation | null>;
}
