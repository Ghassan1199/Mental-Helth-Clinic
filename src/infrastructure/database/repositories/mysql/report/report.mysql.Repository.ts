import { connectToDatabase } from "../../..";
import { DataSource, EntityManager, IsNull, MoreThanOrEqual, Not } from "typeorm";
import { IReportRepository } from "../../../../../domain/interfaces/repositories/report/IReportRepository";
import { Report } from "../../../../../domain/entities/Report";
import { isNativeError } from "util/types";

export class ReportMysqlRepository implements IReportRepository {
  private client!: DataSource;

  constructor() {
    this.init();
  }

  private async init() {
    this.client = await connectToDatabase();
  }


  async createUserReport(reporterId: number, userId: number, description: string): Promise<void> {
        await this.client.getRepository(Report).save({ reporterId, userId, description, date: new Date() });  
    }
    async createMedicalRecordReport(reporterId: number, medicalRecordId: number, description: string): Promise<void> {
        await this.client.getRepository(Report).save({ reporterId, medicalRecordId, description, date: new Date() });  
    }
    
    async createAppointmentReport(reporterId: number, appointmentId: number,description: string, photo: string): Promise<Report> {
        return await this.client.getRepository(Report).save({ reporterId, appointmentId, description, date: new Date(), photo });  
    }


    async getReports(): Promise<Report[]> {
        return await this.client.getRepository(Report).find({where:{appointmentId: Not(IsNull())},relations:["reporter", "appointment", "appointment.user", "appointment.user.userProfile", "appointment.specialist", "appointment.specialist.specialistProfile"]});  
    }


    async getReportsForUser(reporterId: number): Promise<Report[]> {
        return await this.client.getRepository(Report).find({where:{reporterId}});  
    }

    async showReport(reportId: number): Promise<Report | null> {
        return await this.client.getRepository(Report).findOne({where:{
            id: reportId
        }});  
    }

    async getReportByBoth(reporterId: number, userId: number, date: Date): Promise<Report | null> {
        
        return await this.client.getRepository(Report).findOne({
            where: {
                reporterId,
                userId,
                date: MoreThanOrEqual(date),
            }
        });
    }

    async getMedicalRecordReports(medicalRecordId: number): Promise<Report[]> {
        
        return await this.client.getRepository(Report).find({
            where: {
                medicalRecordId
            }
        });
    }


    async getMedicalRecordReportByBoth(reporterId: number, medicalRecordId: number): Promise<Report | null> {
        return await this.client.getRepository(Report).findOne({
            where: {
                reporterId,
                medicalRecordId
            }
        });
    }
    
    async updateReport(record: Report, entityManager?: EntityManager): Promise<void> {
        if(entityManager){
             await entityManager.save(Report, record);
        }else {
            await this.client.getRepository(Report).save(record);
        }
    }

    async deleteReport(record: Report, entityManager?: EntityManager): Promise<void> {

            await this.client.getRepository(Report).remove(record);
        
    }

    async getAppointmentReport(reporterId: number, appointmentId: number): Promise<Report | null> {
        return await this.client.getRepository(Report).findOne({
            where: {
                reporterId,
                appointmentId
            }
        });
    }

}
