import schedule from "node-schedule";
import { OtpMysqlRepository } from "../../infrastructure/database/repositories/mysql/otp.mysql.Repository";
import { LessThan, LessThanOrEqual, MoreThan, And, MoreThanOrEqual } from "typeorm";
import { SpecialistMysqlRepository } from "../../infrastructure/database/repositories/mysql/specs/spec.mysql.Repository";
import { injectable } from "tsyringe";
import { AppointmentMysqlRepository } from "../../infrastructure/database/repositories/mysql/appointment/Appointment.mysql.Repository";
import { NotificationService } from "./Notification.Service";
import { NotificationMysqlRepository } from "../../infrastructure/database/repositories/mysql/Notification.mysql.Repository";
import { UserMysqlRepository } from "../../infrastructure/database/repositories/mysql/user.mysql.Repository";
@injectable()
class Scheduler {
  otpRepository: OtpMysqlRepository;
  specRepository: SpecialistMysqlRepository;
  appointmentRepository: AppointmentMysqlRepository;
  notificationService: NotificationService;
  userRepository: UserMysqlRepository;

  constructor() {
    this.otpRepository = new OtpMysqlRepository();
    this.specRepository = new SpecialistMysqlRepository();
    this.appointmentRepository = new AppointmentMysqlRepository();
    this.notificationService = new NotificationService(new NotificationMysqlRepository());
    this.userRepository = new UserMysqlRepository();
  }

  async run() {

    schedule.scheduleJob("*0 0 * * *", async () => {
      //0 0 * * *
      //*/10 * * * * *
      try {
         this.deleteOtpsJop();
         this.removeUsersJop();
         this.unblockBlockedUsers();
      } catch (error) {
        console.log("can`t connect to the DB");
      }
    });


     // New job to run every minute
     schedule.scheduleJob("* * * * *", async () => {
      try {

        console.log("Checking appointments...");
         this.checkAppointmentsJob();
         this.markAppointmentsAsComplete(); 
      } catch (error) {
        console.log("can`t connect to the DB");
      }
    });
  }

  private async deleteOtpsJop() {
    try {
      const otps = await this.otpRepository.getOtps({
        expiredAt: LessThan(new Date()),
      });

      for (const otp of otps) {
        await this.otpRepository.remove(otp);
      }
    } catch (error) {
      console.error(error);
    }
  }

  private async removeUsersJop() {
    try {
      let deletedAt = new Date();
      deletedAt.setDate(deletedAt.getDate() - 15);

      await this.specRepository.deleteUsers({
        isDeleted: true,
        deletedAt: LessThanOrEqual(deletedAt),
      });
    } catch (error) {
      console.error(error);
    }
  }

  private async unblockBlockedUsers() {
    const users = await this.userRepository.getBlockedUsers();

    for (const user of users) {
      user.isBlocked = false;
      user.blockedUntil = null;
      user.alertCounter = 0;  
      await this.userRepository.updateUser(user);
    }
  }

  private async checkAppointmentsJob() {
    try {
      const now = new Date(new Date().getTime() + 60 * 60 * 3 * 1000);
      const fiveMinutesLater = new Date(now.getTime() + 5 * 60000);



      const appointments = await this.appointmentRepository.getAppointments({
        date: And(MoreThanOrEqual(now), LessThanOrEqual(fiveMinutesLater)),
        isCancelled: false,
        isNotified: false,
        isCompleted: false,
      });



      
      for (const appointment of appointments) {
        // Process the appointment
        appointment.isNotified = true;
        await this.appointmentRepository.update(appointment);

        await this.notificationService.create("7","Session is starting soon", `Session is starting soon at ${appointment.date}`, appointment.user);
        await this.notificationService.create("7","Session is starting soon", `Session is starting soon at ${appointment.date}`, appointment.specialist);

     
      }
    } catch (error) {
      console.error(error);
    }
  }

  private async markAppointmentsAsComplete() {
    try {
      const now = new Date(new Date().getTime() + 60 * 60 * 3 * 1000);

      const appointments = await this.appointmentRepository.getAppointments({
        date: LessThan(new Date(now.getTime() - 30 * 60000)), // Appointments older than 30 minutes
        isCancelled: false,
        isCompleted: false,
      });

      for (const appointment of appointments) {
              // Mark the appointment as completed
        appointment.isCompleted = true;
      

        await this.appointmentRepository.update(appointment);

        // Notify the user and specialist
        await this.notificationService.create("1","Session completed", `Your session at ${appointment.date} has been completed.`, appointment.user);
        await this.notificationService.create("1","Session completed", `Your session at ${appointment.date} has been completed.`, appointment.specialist);
      }
    } catch (error) {
      console.error(error);     
    }
  }
}
export default Scheduler;