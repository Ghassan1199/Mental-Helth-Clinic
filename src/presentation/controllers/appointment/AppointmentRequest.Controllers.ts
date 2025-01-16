import { Response, Request, NextFunction } from "express";
import { AppointmentRequestService } from "../../../application/services/appointment/Appointment.Request.Service";
import { ClinicService } from "../../../application/services/Clinic.Service";
import AuthenticatedRequest from "../../../domain/interfaces/utils/AuthenticatedRequest";
import StatusError from "../../../application/utils/error";
import AppointmentRequestResource from "../../resources/AppointmentRequestResource";
import { inject, injectable } from "tsyringe";
import { successfulResponse } from "../../../application/utils/responseMessage";
@injectable()
export class AppointmentRequestController {
  private appointmentRequestService: AppointmentRequestService;
  private clinicService: ClinicService;

  constructor(
    @inject(AppointmentRequestService)
    appointmentRequestService: AppointmentRequestService,
    @inject(ClinicService) clinicService: ClinicService,
  ) {
    this.appointmentRequestService = appointmentRequestService;
    this.clinicService = clinicService;
  }

  async create(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const clinic = await this.clinicService.getById(req.params.clinicId);
      const appointmentRequest = await this.appointmentRequestService.create(
        clinic.doctor,
        req.auth!.user,
        req.body.description,
      );
      return res.status(201).json({
        success: true,
        message: "appointment created successfully",
      //  data: await new AppointmentRequestResource().init(appointmentRequest),
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

  async createBySpec(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { description, date, userId } = req.body;

      await this.appointmentRequestService.createByspec(
        req.auth!.user,
        userId,
        description,
        date,
      );

      res.status(201).send(successfulResponse("request has been created"));
    } catch (err: any) {
      next(err);
    }
  }
  async index(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const user = req.auth!.user;
      const appointmentRequests =
        await this.appointmentRequestService.getSpecialistAppointmentRequest(
          user,
        );
      return res.status(200).json({
        success: true,
        message: "appointmentRequests returned successfully",
        data: await new AppointmentRequestResource().init(appointmentRequests),
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

  async patientRequest(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<Response> {
    try {
      const appointmentRequests =
        await this.appointmentRequestService.getPatientAppointmentRequest(
          req.auth!.user,
        );
      return res.status(200).json({
        success: true,
        message: "appointmentRequests returned successfully",
        data: await new AppointmentRequestResource().init(appointmentRequests),
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

  async setDate(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const appointmentRequest = await this.appointmentRequestService.setDate(
        req.params.id,
        req.body.date,
      );
      return res.status(200).json({
        success: true,
        message: "appointmentRequests checked successfully",
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

  async reject(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const appointmentRequest = await this.appointmentRequestService.reject(
        req.params.id,
      );
      return res.status(200).json({
        success: true,
        message: "appointmentRequests checked successfully",
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

  async accept(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const appointmentRequest = await this.appointmentRequestService.accept(
        req.params.id,
      );
      return res.status(200).json({
        success: true,
        message: "appointmentRequests accepted successfully",
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

  async refuse(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const appointmentRequest = await this.appointmentRequestService.refuse(
        req.params.id,
      );
      return res.status(200).json({
        success: true,
        message: "appointmentRequests refused successfully",
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

  async destroy(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const appointmentRequest = await this.appointmentRequestService.remove(
        req.params.id,
      );
      return res.status(200).json({
        success: true,
        message: "appointmentRequest removed successfully",
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
}
