import { EntityManager } from "typeorm";
import { Report } from "../../../entities/Report";

export interface IReportRepository {
    createAppointmentReport(reporterId: number, appointmentId: number, description: string, photo: string): Promise<Report>;
    createUserReport(reporterId: number, userId: number, description: string): Promise<void>;
    createMedicalRecordReport(reporterId: number, medicalRecordId: number, description: string): Promise<void>;
    getReports(): Promise<Report[]>;
    showReport(reportId: number): Promise<Report | null>;
    getReportsForUser(reporterId: number): Promise<Report[]>;
    getReportByBoth(reporterId: number, userId: number, date: Date): Promise<Report | null>;
    getMedicalRecordReports(medicalRecordId: number): Promise<Report[]>;
    getMedicalRecordReportByBoth(reporterId: number, medicalRecordId: number): Promise<Report | null>;
    updateReport(record: Report, entityMAnager?: EntityManager): Promise<void>;
    deleteReport(record: Report, entityMAnager?: EntityManager): Promise<void>;
    getAppointmentReport(reporterId: number, appointmentId: number): Promise<Report | null>;



}
