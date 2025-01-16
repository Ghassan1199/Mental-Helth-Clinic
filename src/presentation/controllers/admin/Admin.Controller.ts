import { Response, NextFunction } from "express";
import AuthenticatedRequest from "../../../domain/interfaces/utils/AuthenticatedRequest";
import { successfulResponse } from "../../../application/utils/responseMessage";
import { AdminService } from "../../../application/services/admin/admin.service";
import { inject, injectable } from "tsyringe";
@injectable()
export class AdminController {
  private adminService: AdminService;

  constructor(@inject(AdminService) adminService: AdminService) {
    this.adminService = adminService;
  }

  async register(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { fullName, email, password, isSuper } = req.body;

      await this.adminService.register(fullName, email, password, isSuper);

      res.status(201).json(successfulResponse("Admin has been added"));
    } catch (error: any) {
      next(error);
    }
  }

  async login(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const data = this.adminService.login(email, password);

      res.status(200).json(successfulResponse("Logged in", await data));
    } catch (error: any) {
      next(error);
    }
  }
}
