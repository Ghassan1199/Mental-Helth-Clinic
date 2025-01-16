import { Response, NextFunction } from "express";
import AuthenticatedRequest from "../../../domain/interfaces/utils/AuthenticatedRequest";
import { successfulResponse } from "../../../application/utils/responseMessage";
import { inject, injectable } from "tsyringe";
import { ReportService } from "../../../application/services/report/Report.Service";
import ReportResource from "../../resources/ReportResource";
import StatusError from "../../../application/utils/error";
import env from "dotenv";
import { deleteFromCloudinary } from "../../middlewares/handlers/cloudinary.handler";
env.config();

@injectable()
export class ReportController {
  private reportService: ReportService;

  constructor(@inject(ReportService) reportService: ReportService) {
    this.reportService = reportService;
  }

  async createUserReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {

        const reporter = req.auth!.user;
      const { userId, description } = req.body;

      await this.reportService.createUserReport(reporter.id, userId, description);

      res.status(201).json(successfulResponse("Reported successfully"));
    } catch (error: any) {
      next(error);
    }
  }




  async createMedicalReocrdReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {

        const reporter = req.auth!.user;
      const { medicalRecordId, description } = req.body;

      if(reporter.roleId != Number(process.env.DOCTOR)) throw new StatusError(403, "You must be a doctor.");


      await this.reportService.createMedicalReocrdReport(reporter.id, medicalRecordId, description);

      res.status(201).json(successfulResponse("Reported successfully"));
    } catch (error: any) {
      next(error);
    }
  }

  async createAppointmentReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    let report;
    try {
      const file = req.files![0];
      const reporter = req.auth!.user;
      const { appointmentId, description } = req.body;

      report = await this.reportService.createUserAppointmentReport(reporter.id, appointmentId, description, file);

      res.status(201).json(successfulResponse("Reported successfully"));
  } catch(error: any) {
            if (report) deleteFromCloudinary(report.photo.match(/report_photos\/(.*?)(?=\.[^.]*$)/)?.[0]! );

      next(error);
    }
  }


  async getReports(
    _req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const reports = this.reportService.getAllReports();


      res.status(200).json(successfulResponse("Reports", await new ReportResource().init(await reports)));
    } catch (error: any) {
      next(error);
    }
  }

  async getReportsForUser(  
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {       
        
      const reporter = req.auth!.user;
      const reports = this.reportService.getReportsForUser(reporter.id);

      res.status(200).json(successfulResponse("Reports", await reports));
    } catch (error: any) {
      next(error);
    }
  }


  async showReport(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {       
        
      const {reportId } = req.params;
      const report = this.reportService.showReport(Number(reportId));

      res.status(200).json(successfulResponse("Report", (await report)!));
    } catch (error: any) {
      next(error);
    }
  }

  async handleReport(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {       
        
      const {reportId } = req.params;
      const {action } = req.body;

       await this.reportService.handleReport(Number(reportId), action);

      res.status(200).json(successfulResponse("Report has been handled"));
    } catch (error: any) {
      next(error);
    }
  }
}
