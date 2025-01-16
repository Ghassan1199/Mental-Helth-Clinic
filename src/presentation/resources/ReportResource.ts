import { Appointment } from "../../domain/entities/Appointment";
import { Report } from "../../domain/entities/Report";

class ReportResource {
    constructor() {
    }

    async init(model: any) {
        if (Array.isArray(model)) {
            let resources = [];
            for (let i = 0; i < model.length; i++) {
                resources.push(await this.initializeResource(model[i]));
            }
            return resources;
        } else {
            return await this.initializeResource(model);
        }
    }

    async initializeResource(report: Report) {
        
        let reporterName;
        let reportedName;
        let role;
    if(report.reporterId == report.appointment.specialist.id){
        reporterName = report.appointment.specialist.specialistProfile?.fullName;
        reportedName = report.appointment.user.userProfile?.fullName;
        role = "D";
        
    }else{
        reportedName = report.appointment.specialist.specialistProfile?.fullName;
        reporterName = report.appointment.user.userProfile?.fullName;
        role = "U";     
    }

    report.appointment.user.password = "";
    report.appointment.specialist.password = "";
          

        return {            
            reportId: report.id,
            role,
            appointmentId: report.appointment.id,
            appointmentDate: report.appointment.date,
            appointmentPrice: report.appointment.price,
            isAppointmentCancelled: report.appointment.isCancelled,
            isAppointmentCompleted: report.appointment.isCompleted,
            date: report.date,
            description: report.description,
            reporterId: report.reporterId,
            photo: report.photo,
            user: report.appointment.user,
            specialist: report.appointment.specialist
        };                          
    }   
}
export default ReportResource;  
