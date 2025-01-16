import { inject, injectable } from "tsyringe";
import Validator from "../../validation/validator";
import { IReportRepository } from "../../../domain/interfaces/repositories/report/IReportRepository";
import StatusError from "../../utils/error";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { IMedicalRecordRepository } from "../../../domain/interfaces/repositories/medical-record/IMedicalRecordRepository";
import env from "dotenv";
import { IAppointmentRepository } from "../../../domain/interfaces/repositories/appointment/IAppointmentRepository";
import { FileData } from "../../../domain/interfaces/utils/AuthenticatedRequest";
import { uploadToCloudinary } from "../../../presentation/middlewares/handlers/cloudinary.handler";
import { Report } from "../../../domain/entities/Report";
import { EmailService } from "../Email.Service";
import { IWalletRepository } from "../../../domain/interfaces/repositories/IWalletRepository";
import { connectToDatabase } from "../../../infrastructure/database";
env.config();

@injectable()
export class ReportService {
  private validator: Validator;
  private reportRepository: IReportRepository;
  private userRepository: IUserRepository;
  private medicalRecordRepository: IMedicalRecordRepository;
  private appointmentRepository: IAppointmentRepository;
  private walletRepository: IWalletRepository;
private emailService: EmailService;
  constructor(
    @inject(Validator) validator: Validator,
    @inject("IReportRepository") reportRepository: IReportRepository,
    @inject("IUserRepository") userRepository: IUserRepository,
    @inject("IAppointmentRepository") appointmentRepository: IAppointmentRepository,
  @inject("IMedicalRecordRepository") medicalRecordRepository: IMedicalRecordRepository,
  @inject("IWalletRepository") walletRepository: IWalletRepository

  ) {
    this.validator = validator;
    this.reportRepository = reportRepository;
    this.userRepository = userRepository;
    this.appointmentRepository = appointmentRepository;
    this.medicalRecordRepository = medicalRecordRepository;
    this.walletRepository = walletRepository;
    this.emailService = new EmailService();
  }
  async createUserReport(reporterId: number, userId: number, description: string) {
   
    this.validator.validateRequiredFields({userId, description});

    const user = await this.userRepository.findById(userId);

    if(user == null) throw new StatusError(404, "user not found.");
    if(user.roleId == Number(process.env.DOCTOR)) throw new StatusError(403, "You can't report a doctor.");

    if(user.isBlocked) throw new StatusError(403, "You can't report this user.");


    const oneMonthAgo = new Date(Date.now());
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const report = await this.reportRepository.getReportByBoth(reporterId, userId, oneMonthAgo);

    if(report != null) throw new StatusError(400, "You have already reported this user within a month.");

    user.alertCounter += 1;

    if(user.alertCounter >= 3){
      user.isBlocked = true;
      user.blockedUntil = new Date(Date.now() + (user.blockCounter + 1) * 30 * 24 * 60 * 60 * 1000);
      user.blockCounter += 1;
      this.emailService.sendEmail(user.email, "You have been blocked", `You have been blocked for ${user.blockCounter} month.`);
    }

    await this.userRepository.updateUser(user);


    await this.reportRepository.createUserReport(reporterId, userId, description);
    } 

    


       async createMedicalReocrdReport(reporterId: number, medicalRecordId: number, description: string) {
            this.validator.validateRequiredFields({medicalRecordId, description});

            const medicalRecord = await this.medicalRecordRepository.getMR(medicalRecordId);

            if(medicalRecord == null) throw new StatusError(404, "medical record not found.");

            const report = await this.reportRepository.getMedicalRecordReportByBoth(reporterId, medicalRecordId);

            if(report != null) throw new StatusError(400, "You have already reported this medical record.");

            const reports = await this.reportRepository.getMedicalRecordReports(medicalRecordId);
            if(reports.length >= 2){
                const user = await this.userRepository.findById(medicalRecord.doctorId);
                if(user == null) throw new StatusError(404, "user not found.");
               
                user.alertCounter += 1;
                if(user.alertCounter >= 2){
                  user.isBlocked = true;
                  user.blockedUntil = new Date(Date.now() + (user.blockCounter + 1) * 30 * 24 * 60 * 60 * 1000);
                  user.blockCounter += 1;
                  this.emailService.sendEmail(user.email, "You have been blocked", `You have been blocked for ${user.blockCounter} month.`);

                }
                await this.userRepository.updateUser(user);
                await this.medicalRecordRepository.deleteMedicalRecord(medicalRecordId);
            }

            await this.reportRepository.createMedicalRecordReport(reporterId, medicalRecordId, description);
       }
  
        async createUserAppointmentReport(reporterId: number, appointmentId: number, description: string, photo: FileData): Promise<Report> {
          this.validator.validateRequiredFields({ reporterId, appointmentId, description, photo });

            const appointment = await this.appointmentRepository.findById(appointmentId);

            if(appointment == null) throw new StatusError(404, "appointment not found.");

            if(appointment.isCancelled)throw new StatusError(404, "appointment is cancelled.");

            if(appointment.isCompleted)throw new StatusError(404, "appointment is completed.");


            const prevRep = await this.reportRepository.getAppointmentReport(reporterId, appointmentId);
            if(prevRep) throw new StatusError(404, "You have already reported this appointment.");
            
                  const url = await uploadToCloudinary(photo.data!, "image", "report_photos");
            

            return await this.reportRepository.createAppointmentReport(reporterId, appointmentId, description, url);
        }

  
        async getAllReports(){
            return await this.reportRepository.getReports();
        }

        async getReportsForUser(reporterId: number){
            this.validator.validateRequiredFields({reporterId});
            return await this.reportRepository.getReportsForUser(reporterId);
        }

        async showReport(reportId: number) {
            this.validator.validateRequiredFields({reportId});
            const report = await this.reportRepository.showReport(reportId);

            if(report == null) throw new StatusError(404, "report not found.");

            return report;
        }

  



        async handleReport(reportId: number, action: boolean){

          if(action == undefined) throw new StatusError(400, "ACTION is required"); 
          const report = await this.showReport(reportId);

          const appointment = await this.appointmentRepository.findById(report.appointmentId);

          if(appointment == null) throw new StatusError(404, "appointment not found.");

          const user = await this.userRepository.findById(appointment.userId);
              if(user == null) throw new StatusError(400, "user not found.");

          const specialist = await this.userRepository.findById(appointment.specialistId);
          if(specialist == null) throw new StatusError(400, "user not found.");

          if(action){
 
            appointment.isCancelled = true;
            if(report.reporterId == appointment.userId){

              const userWallet = await this.walletRepository    .findByUser(user);
              if(userWallet == null)   throw new StatusError(400, "userWallet not found.");

              const specialistWallet = await this.walletRepository.findByUser(specialist);
              if(specialistWallet == null) throw new StatusError(400, "userWallet not found.");

              userWallet.balance += Number(appointment.price);
              specialistWallet.balance -= Number(appointment.price);

              specialist.alertCounter += 1;
              if(specialist.alertCounter >= 3){
                specialist.isBlocked = true;
                specialist.blockedUntil = new Date(Date.now() + (specialist.blockCounter + 1) * 30 * 24 * 60 * 60 * 1000);
                specialist.blockCounter += 1;
                this.emailService.sendEmail(specialist.email, "You have been blocked", `You have been blocked for ${specialist.blockCounter} month.`);
              }

          

                   (
        await connectToDatabase()
      ).transaction(async (transactionalEntityManager) => {
        (await this.walletRepository.update(
          userWallet,
          transactionalEntityManager
        )) as any;
        await this.walletRepository.update(
          specialistWallet,
          transactionalEntityManager
        );
  
        await this.userRepository.updateUser(specialist);

      });

          }else{
            user.alertCounter += 1;
            if(user.alertCounter >= 3){
              user.isBlocked = true;
              user.blockedUntil = new Date(Date.now() + (user.blockCounter + 1) * 30 * 24 * 60 * 60 * 1000);
              user.blockCounter += 1;
              this.emailService.sendEmail(user.email, "You have been blocked", `You have been blocked for ${user.blockCounter} month.`);
            }
            await this.userRepository.updateUser(user);

          }        
          await this.appointmentRepository.update(appointment);

        }

        await this.reportRepository.deleteReport(report);

}
}
