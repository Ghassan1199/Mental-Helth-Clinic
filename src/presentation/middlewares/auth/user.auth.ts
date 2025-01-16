import { Response, NextFunction } from "express";
import { UserService } from "../../../application/services/patient/Patient.auth.Service";
import JwtService from "../../../application/services/jwt.Service";
import StatusError from "../../../application/utils/error";
import AuthenticatedRequest from "../../../domain/interfaces/utils/AuthenticatedRequest";
import { SpecialistService } from "../../../application/services/specs/Specialist.Service";
import { successfulResponse } from "../../../application/utils/responseMessage";
import { UserMysqlRepository } from "../../../infrastructure/database/repositories/mysql/user.mysql.Repository";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { ISpecialistRepository } from "../../../domain/interfaces/repositories/specs/ISpecialist.repository";
import { inject, injectable } from "tsyringe";
import { SpecialistMysqlRepository } from "../../../infrastructure/database/repositories/mysql/specs/spec.mysql.Repository";
import { IOAuthRepository } from "../../../domain/interfaces/repositories/IOAuthRepository";
@injectable()
class UserAuth {
  private authTokenServices: JwtService;
  private userRepo: IUserRepository;
  private oAuthRepo: IOAuthRepository;

  constructor(
    @inject(JwtService) authTokenServices: JwtService,
    @inject("IUserRepository") userRepo: IUserRepository,
    @inject("IOAuthRepository") oAuthRepo: IOAuthRepository
  ) {
    this.userRepo = userRepo;
    this.oAuthRepo = oAuthRepo;
    this.authTokenServices = authTokenServices;

    this.getUser = this.getUser.bind(this);
    this.checkUser = this.checkUser.bind(this);
    this.generateRT = this.generateRT.bind(this);
  }

  async getUser(token: string, tokenType: string) {
    if (!token) throw new StatusError(400, "No Token Provided.");
    const payload = await this.authTokenServices.verify(token, tokenType);
    const user = await this.userRepo.findById(payload.userId);
    return user;
  }

  async checkUser(
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
  ) {
    try {
      const token = req.headers.authorization!;
      const user = await this.getUser(token, "acc");
      if (!user) throw new StatusError(403, "Not allowed");
      const oAuth = this.oAuthRepo.findByUser(user);

      if (user.isDeleted) throw new StatusError(400, "Account is deleted");

      if (user.isBlocked) throw new StatusError(400, "Account is blocked");

      if (!user.isActive) throw new StatusError(400, "Account is not active");

      if ( (await oAuth)?.accessToken != token)
        throw new StatusError(
          400,
          "There is another session open , please login again"
        );

      req.auth = {
        user: user,
      };

      next();
    } catch (error: any) {
      next(error);
    }
  }

  async generateRT(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = req.headers.authorization!;
      const user = await this.getUser(token, "ref");
      if (!user) throw new StatusError(404, "User not found");

      if (user.isDeleted) throw new StatusError(400, "Account is deleted");

      if (user.isBlocked) throw new StatusError(400, "Account is blocked");

      const accessToken = await this.authTokenServices.generateAccessToken(
        user.id
      );
      const refreshToken = await this.authTokenServices.generateRefreshToken(
        user.id
      );

      res
        .status(200)
        .json(successfulResponse("Tokens", { accessToken, refreshToken }));
    } catch (error: any) {
      next(error);
    }
  }
}

export default UserAuth;
