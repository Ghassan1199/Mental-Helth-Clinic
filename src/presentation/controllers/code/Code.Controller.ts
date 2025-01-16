import { Response, NextFunction } from "express";
import AuthenticatedRequest from "../../../domain/interfaces/utils/AuthenticatedRequest";
import { successfulResponse } from "../../../application/utils/responseMessage";
import { CodeService } from "../../../application/services/codes/Code.Service";
import { inject, injectable } from "tsyringe";
@injectable()
export class CodeController {
  private codeService: CodeService;

  constructor(@inject(CodeService) codeService: CodeService) {
    this.codeService = codeService;
  }

  async addCodes(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { amount, numberOfCodes } = req.body;

      const codes = await this.codeService.create(amount, numberOfCodes);

      res
        .status(201)
        .json(successfulResponse("Codes have been generated", codes));
    } catch (error: any) {
      next(error);
    }
  }

  async getCodes(
    _req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const codes = this.codeService.getAllCodes();

      res.status(200).json(successfulResponse("Codes", await codes));
    } catch (error: any) {
      next(error);
    }
  }
}
