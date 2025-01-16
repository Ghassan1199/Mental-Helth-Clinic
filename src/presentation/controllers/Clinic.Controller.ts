import { Response, Request } from "express";
import { ClinicService } from "../../application/services/Clinic.Service";
import AuthenticatedRequest from "../../domain/interfaces/utils/AuthenticatedRequest";
import { inject, injectable } from "tsyringe";
@injectable()
export class ClinicController {
  private clinicService: ClinicService;

  constructor(@inject(ClinicService) clinicService: ClinicService) {
    this.clinicService = clinicService;
  }

  async index(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const clinics = await this.clinicService.index();
      return res.status(201).json({
        success: true,
        message: "clinics returned successfully",
        data: clinics,
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

  async getAllDoctors(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const docs = await this.clinicService.getDoctors();

      return res.status(201).json({
        success: true,
        message: "doctors returned successfully",
        data: docs,
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

  async getDoctorProfile(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const { doctorId } = req.params;
      const doc = await this.clinicService.getDoctorProfile(Number(doctorId));

      return res.status(201).json({
        success: true,
        message: "profile returned successfully",
        data: doc,
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
