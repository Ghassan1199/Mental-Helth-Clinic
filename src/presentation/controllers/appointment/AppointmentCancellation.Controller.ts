import { Response, Request } from "express";
import { ClinicService } from "../../../application/services/Clinic.Service";
import AuthenticatedRequest from "../../../domain/interfaces/utils/AuthenticatedRequest";
import { AppointmentCancellationService } from "../../../application/services/appointment/Appointment.Cancellation.Service";
import { UserService } from "../../../application/services/patient/Patient.auth.Service";
import { AppointmentService } from "../../../application/services/appointment/Appointment.Service";
import { inject, injectable } from "tsyringe";
@injectable()
export class AppointmentCancellationController {
  private appointmentCancellationService: AppointmentCancellationService;
  private appointmentService: AppointmentService;
  private userService: UserService;
  private clinicService: ClinicService;

  constructor(
    @inject(AppointmentCancellationService)
    appointmentCancellationService: AppointmentCancellationService,
    @inject(AppointmentService) appointmentService: AppointmentService,
    @inject(ClinicService) clinicService: ClinicService,
    @inject(UserService) userService: UserService
  ) {
    this.appointmentCancellationService = appointmentCancellationService;
    this.appointmentService = appointmentService;
    this.userService = userService;
    this.clinicService = clinicService;
  }

  async create(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const appointment = await this.appointmentService.getById(
        req.params.appointmentId
      );

      const appointmentCancellation =
        await this.appointmentCancellationService.create(
          req.auth!.user,
          appointment,
          req.body.description
        );
      return res.status(201).json({
        success: true,
        message: "appointmentCancellation cancelled successfully",
        data: appointmentCancellation,
      });
    } catch (error: any) {          
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal server error";
      return res.status(statusCode).json({
        success: false,
        message: message,
      });
    }
  }
}
