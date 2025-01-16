import { inject } from "tsyringe";
import { SessionInfoService } from "../../application/services/sessionInfo/SessionInfo.Service";
import { SessionInfo } from "../../domain/entities/SessionInfo";

class AppointmentResource {
    private sessionInfoService: SessionInfoService;
    constructor(@inject(SessionInfoService)
    sessionInfoService: SessionInfoService) {
        this.sessionInfoService = sessionInfoService;
     }

    async init(model: any) {
        const sessionInfo = await this.sessionInfoService.getSessionInfo();
        if (Array.isArray(model)) {
            let resources = [];
            for (let i = 0; i < model.length; i++) {
                resources.push(await this.initializeResource(model[i], sessionInfo[0]));
            }
            return resources;
        } else {
            return await this.initializeResource(model, sessionInfo[0]);
        }
    }

    async initializeResource(Appointment: any, sessionInfo: SessionInfo) {
            const appointmentDate = new Date(Appointment.date);
        const currentDate = new Date(new Date().getTime() + 60 * 3 * 60000);
        const isPassed = currentDate > appointmentDate;
        const isWithin30Minutes = currentDate < new Date(appointmentDate.getTime() + Number(sessionInfo.time) * 60000); // Adding 30 minutes in milliseconds

        return {
          id: Appointment.id,
          date: Appointment.date,
          isCancelled: Appointment.isCancelled,
          isCompleted: Appointment.isCompleted,
          isReady: isPassed && isWithin30Minutes,
          specialistId: await Appointment.specialist.id,
          specialistName: await Appointment.specialist?.specialistProfile?.fullName,
          patientId: await Appointment.user.id,
          patientName: await Appointment.user.username,
        };
    }
}
export default AppointmentResource;
