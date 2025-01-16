import { Response, NextFunction } from "express";
import AuthenticatedRequest from "../../../domain/interfaces/utils/AuthenticatedRequest";
import { successfulResponse } from "../../../application/utils/responseMessage";
import { SessionInfoService } from "../../../application/services/sessionInfo/SessionInfo.Service";
import { inject, injectable } from "tsyringe";
@injectable()
export class SessionInfoController {
  private sessionInfoService: SessionInfoService;

  constructor(
    @inject(SessionInfoService)
    sessionInfoService: SessionInfoService
  ) {
    this.sessionInfoService = sessionInfoService;
  }

  async addSessionInfo(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { time, price } = req.body;

      await this.sessionInfoService.addSessionInfo(time, price);

      res.status(201).json(successfulResponse("Session info is added"));
    } catch (error: any) {
      next(error);
    }
  }

  async getSessionInfo(
    _req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const s = this.sessionInfoService.getSessionInfo();

      res.status(200).json(successfulResponse("Session Info", await s));
    } catch (error: any) {
      next(error);
    }
  }

  async updateSessionInfo(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { time, price } = req.body;
      const { sessionInfoId } = req.params;

      await this.sessionInfoService.updateSessionInfo(
        Number(sessionInfoId),
        time,
        price
      );

      res.status(201).json(successfulResponse("Session info is updated"));
    } catch (error: any) {
      next(error);
    }
  }
}
