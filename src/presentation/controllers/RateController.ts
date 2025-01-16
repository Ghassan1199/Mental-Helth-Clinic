import { Response, Request } from "express";
import { ClinicService } from "../../application/services/Clinic.Service";
import { RateService } from "../../application/services/Rate.service";
import AuthenticatedRequest from "../../domain/interfaces/utils/AuthenticatedRequest";
import { inject, injectable } from "tsyringe";
@injectable()
export class RateController {
  private rateService: RateService;
  private clinicService: ClinicService;

  constructor(
    @inject(RateService) rateService: RateService,
    @inject(ClinicService) clinicService: ClinicService
  ) {
    this.rateService = rateService;
    this.clinicService = clinicService;
  }

  async create(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const clinic = await this.clinicService.getById(req.params.clinicId);
      const rate = await this.rateService.create(
        clinic,
        req.auth!.user,
        req.body.value
      );
      return res.status(201).json({
        success: true,
        message: "rate created successfully",
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
