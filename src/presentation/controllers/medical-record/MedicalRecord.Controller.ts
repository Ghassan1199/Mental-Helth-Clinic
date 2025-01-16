import { Response, NextFunction } from "express";
import AuthenticatedRequest from "../../../domain/interfaces/utils/AuthenticatedRequest";
import { MedicalRecordService } from "../../../application/services/medical-record/MedicalRecord.Service";
import { successfulResponse } from "../../../application/utils/responseMessage";
import { inject, injectable } from "tsyringe";
import MedicalRecordResource from "../../resources/MedicalRecordResource";
@injectable()
export class MedicalRecordController {
  private medicalRecordService: MedicalRecordService;

  constructor(
    @inject(MedicalRecordService) medicalRecordService: MedicalRecordService
  ) {
    this.medicalRecordService = medicalRecordService;
  }

  async createMedicalRecord(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const specialist = req.auth!.user;
      const { patientId } = req.body;

      await this.medicalRecordService.createPatientMedicalRecord(
        specialist,
        Number(patientId),
        req.body
      );

      res
        .status(201)
        .json(successfulResponse("Medical record has been created"));
    } catch (error: any) {
      next(error);
    }
  }

  async updateMedicalRecord(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { recordId } = req.params;
      const specialist = req.auth!.user;

      await this.medicalRecordService.updatePatientMedicalRecord(
        specialist.id,
        Number(recordId),
        req.body
      );

      res
        .status(200)
        .json(successfulResponse("Medical record has been updated"));
    } catch (error: any) {
      next(error);
    }
  }

  async getMedicalRecords(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { patientId } = req.params;

      const mr = await this.medicalRecordService.getPatientMedicalRecords(patientId
      );

      res.status(200).json(successfulResponse("Medical records", await new MedicalRecordResource().init(mr),));
    } catch (error: any) {
      next(error);
    }
  }


  async getOneRecord(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { recordId } = req.params;

      const rec = await this.medicalRecordService.getOneRecord(
        Number(recordId),
      );

      res
        .status(200)
        .json(successfulResponse("Medical record", rec));
    } catch (error: any) {
      next(error);
    }
  }
}
