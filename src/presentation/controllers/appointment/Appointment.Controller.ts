import { Response, Request } from "express";
import { ClinicService } from "../../../application/services/Clinic.Service";
import AuthenticatedRequest from "../../../domain/interfaces/utils/AuthenticatedRequest";
import { AppointmentService } from "../../../application/services/appointment/Appointment.Service";
import StatusError from "../../../application/utils/error";
import { AppointmentRequestService } from "../../../application/services/appointment/Appointment.Request.Service";
import AppointmentResource from "../../resources/AppointmentResource";
import { IsNull } from "typeorm";
import AppointmentRequestResource from "../../resources/AppointmentRequestResource";
import { inject, injectable } from "tsyringe";
import { container } from "tsyringe";
import { SessionInfoService } from "../../../application/services/sessionInfo/SessionInfo.Service";
import { successfulResponse } from "../../../application/utils/responseMessage";


@injectable()
export class AppointmentController {
  private appointmentService: AppointmentService;
  private clinicService: ClinicService;
  private appointmentRequestService: AppointmentRequestService;
  private sessionInfoService!: SessionInfoService

  constructor(
    @inject(AppointmentService) appointmentService: AppointmentService,
    @inject(AppointmentRequestService)
    appointmentRequestService: AppointmentRequestService,
    @inject(ClinicService) clinicService: ClinicService,
  ) {
    this.appointmentService = appointmentService;
    this.clinicService = clinicService;
    this.appointmentRequestService = appointmentRequestService;
    this.sessionInfoService = container.resolve(SessionInfoService);

  }

  async getClinicAppointment(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<Response> {

    try {
      const spec = req.auth!.user;
      const appointments = await this.appointmentService.getClinicAppointment(spec);
      return res.status(200).json({
        success: true,
        message: "appointments returned successfully",
        data: await new AppointmentResource(this.sessionInfoService).init(appointments),
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal server error";
      console.error(error);
      return res.status(statusCode).json({
        success: false,
        message: message,
      });
    }
  }

  async getUserAppointment(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<Response> {
    try {
      const appointments = await this.appointmentService.getUserAppointment(
        req.auth!.user,
      );
      return res.status(200).json({
        success: true,
        message: "appointments returned successfully",
        data: await new AppointmentResource(this.sessionInfoService).init(appointments),
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal server error";
      console.error(error);
      return res.status(statusCode).json({
        success: false,
        message: message,
      });
    }
  }

  async home(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      let appointments;
      let appointmentRequests;
      if (req.auth!.user.roleId == 0) {
        appointments = await this.appointmentService.getUserAppointment(
          req.auth!.user,
        );
        appointmentRequests =
          await this.appointmentRequestService.getPatientAppointmentRequest(
            req.auth!.user,
          );
      } else {
        const clinic = await this.clinicService.getByOwner(req.auth!.user);
        appointments = await this.appointmentService.getClinicAppointment(
          req.auth!.user,
        );

        appointmentRequests =
          await this.appointmentRequestService.getSpecialistAppointmentRequest(
            clinic.doctor,
          );
      }
      return res.status(201).json({
        success: true,
        message: "Home returned successfully",
        data: [
          {
            appointments: await new AppointmentResource(this.sessionInfoService).init(
              appointments!.filter(
                (appointment) =>
                  appointment.isCancelled === false &&
                  appointment.isCompleted === false,
              ),
            ),
          },
          {
            appointmentRequests: {
              appointmentRequests_waitForSpec:
                await new AppointmentRequestResource().init(
                  appointmentRequests!.filter(
                    (request) =>
                      request.status === null &&
                      request.patientApprove === null,
                  ),
                ),

              appointmentRequests_waitForUser:
                await new AppointmentRequestResource().init(
                  appointmentRequests!.filter(
                    (request) =>
                      request.patientApprove == null && request.status != null,
                  ),
                ),
            },
          },
        ],
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal server error";
      console.error(error);
      return res.status(statusCode).json({
        success: false,
        message: message,
      });
    }
  }

  async show(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const appointmentId = req.params.appointmentId;
      const appointment = await this.appointmentService.getById(appointmentId);
      if (appointment.isCompleted) {
        throw new StatusError(400, "appointment is completed .");
      }
  
      if (appointment.isCancelled) {
        throw new StatusError(400, "appointment is ancelled .");
      }
      
      return res.status(201).json({
        success: true,
        message: "appointment returned successfully",
        data: [
          { appointments: await new AppointmentResource(this.sessionInfoService).init(appointment) },
        ],
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



  async complete(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {

      const user = req.auth!.user;
      const appointmentId = req.body.appointmentId;
      await this.appointmentService.markAsComplete(user, appointmentId);

      return res.status(201).json({
        success: true,
        message: "appointment completed successfully",
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


  async checkAppo(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {

      const appoId = req.params.appoId;
      const status = await this.appointmentService.checkAppo(Number(appoId));

      return res.status(201).json(successfulResponse("appo status", status) );
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
