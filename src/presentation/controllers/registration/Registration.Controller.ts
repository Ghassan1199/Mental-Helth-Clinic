import { Response, NextFunction } from "express";
import { successfulResponse } from "../../../application/utils/responseMessage";
import AuthenticatedRequest from "../../../domain/interfaces/utils/AuthenticatedRequest";
import { RegistrationService } from "../../../application/services/registration/Registration.Service";
import { inject, injectable } from "tsyringe";
import RegistrationsRequestResource from "../../resources/registrationsRequestResource";
@injectable()
export class RegistrationController {
  private registrationService: RegistrationService;

  constructor(@inject(RegistrationService) userService: RegistrationService) {
    this.registrationService = userService;
  }

  async handleRequest(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { status, description } = req.body;

      const requestId = Number(req.params.requestId);

      const admin = req.adminAuth!.admin;
      await this.registrationService.handleApprovalDecision(
        admin,
        requestId,
        status,
        description
      );

      res.status(200).json(successfulResponse("Request has been handled"));
    } catch (error: any) {
      next(error);
    }
  }

  async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const status = String(req.query.status);

      const requests = await this.registrationService.getAllRR();

      res.status(200).json(successfulResponse("Requests", [
        {
          accepted: await new RegistrationsRequestResource().init(
            requests.filter(
              (request) =>
                request.status === true
            ),
          ),
        },
        {
          rejected: await new RegistrationsRequestResource().init(
            requests.filter(
              (request) =>
                request.status === false
            ),
          ),
          },

          {
            pending: await new RegistrationsRequestResource().init(
              requests.filter(
                (request) =>
                  request.status === null
              ),
            ),
            },
        
      ],))
    } catch (error: any) {
      next(error);
    }
  }

  async getRequest(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const requestId = Number(req.params.requestId);

      const request = await this.registrationService.getById(requestId);
      res.status(200).json(successfulResponse("Request", request));
    } catch (error: any) {
      next(error);
    }
  }
}
