import { Response, NextFunction } from "express";
import JwtService from "../../../application/services/jwt.Service";
import StatusError from "../../../application/utils/error";
import AuthenticatedRequest from "../../../domain/interfaces/utils/AuthenticatedRequest";
import { AdminService } from "../../../application/services/admin/admin.service";
import { inject, injectable } from "tsyringe";
@injectable()
class AdminAuth {
  private adminServices: AdminService;
  private authTokenServices: JwtService;

  constructor(
    @inject(AdminService) adminServices: AdminService,
    @inject(JwtService) authTokenServices: JwtService
  ) {
    this.adminServices = adminServices;
    this.authTokenServices = authTokenServices;

    this.getAdmin = this.getAdmin.bind(this);
    this.checkAdmin = this.checkAdmin.bind(this);
  }

  async getAdmin(token: string) {
    if (!token) throw new StatusError(400, "No Token Provided.");
    const payload = await this.authTokenServices.verify(token, "acc", "admin");
    const admin = await this.adminServices.getAdmin(payload.userId);
    return admin;
  }

  async checkAdmin(
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
  ) {
    try {
      const token = req.headers.authorization!;
      const admin = await this.getAdmin(token);
      if (!admin) throw new StatusError(403, "Not allowed");

      req.adminAuth = {
        admin: admin,
      };

      next();
    } catch (error: any) {
      next(error);
    }
  }
}

export default AdminAuth;
