import { Response, Request, NextFunction } from "express";
import OtpService from "../../application/services/Otp.Service";
import { successfulResponse } from "../../application/utils/responseMessage";
import JwtService from "../../application/services/jwt.Service";
import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../domain/interfaces/repositories/IUserRepository";
import { IOAuthRepository } from "../../domain/interfaces/repositories/IOAuthRepository";
@injectable()
export class OtpController {
  private otpService: OtpService;
  private jwtService: JwtService;
  private oauthRepo: IOAuthRepository;

  constructor(
    @inject(OtpService) otpService: OtpService,
    @inject(JwtService) jwtService: JwtService,
    @inject("IOAuthRepository") oauthRepo: IOAuthRepository
  ) {
    this.otpService = otpService;
    this.jwtService = jwtService;
    this.oauthRepo = oauthRepo;
  }

  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.otpService.verify(req.body.token);

      const accessToken = await this.jwtService.generateAccessToken(user.id);
      const refreshToken = await this.jwtService.generateRefreshToken(user.id);
      await this.oauthRepo.create(accessToken, refreshToken, user);

      return res.status(200).json(
        successfulResponse("email verified successfully", {
          accessToken,
          refreshToken,
        })
      );
    } catch (error: any) {
      next(error);
    }
  }

  async checkToken(req: Request, res: Response, next: NextFunction) {
    try {
      const id = await this.otpService.checkToken(req.body.token);

      return res.status(200).json(successfulResponse("token is valid"));
    } catch (error: any) {
      next(error);
    }
  }

  async sendNewOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email;
      await this.otpService.sendNewOTP(email);
      return res
        .status(200)
        .json(successfulResponse("email sent successfully"));
    } catch (error: any) {
      next(error);
    }
  }
}
