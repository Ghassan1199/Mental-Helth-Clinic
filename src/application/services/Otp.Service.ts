import { EntityManager } from "typeorm";
import { Otp } from "../../domain/entities/Otp";
import { IOtpRepository } from "../../domain/interfaces/repositories/IOtpRepository";
import Validator from "../validation/validator";
import StatusError from "../utils/error";
import { IUserRepository } from "../../domain/interfaces/repositories/IUserRepository";
import { connectToDatabase } from "../../infrastructure/database";
import { EmailService } from "./Email.Service";
import { inject, injectable } from "tsyringe";
import { User } from "../../domain/entities/User";
@injectable()
export class OtpService {
  private otpRepository!: IOtpRepository;
  private userRepository: IUserRepository;
  private readonly expirationTime: number = 5 * 60 * 1000; // 5 minutes in milliseconds

  private validator: Validator;
  emailService: EmailService;
  constructor(
    @inject("IOtpRepository") otpRepository: IOtpRepository,
    @inject(Validator) validator: Validator,
    @inject("IUserRepository") userRepository: IUserRepository,
    @inject(EmailService) emailService: EmailService,
  ) {
    this.expirationTime = this.expirationTime;
    this.otpRepository = otpRepository;
    this.validator = validator;
    this.userRepository = userRepository;
    this.emailService = emailService;
  }

  async sendNewOTP(email: string): Promise<true> {
    this.validator.validateRequiredFields({ email });
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new StatusError(404, "User not found");

    if (user.isDeleted) throw new StatusError(404, "Account is deleted");

    const otp = await this.create(user.id);

    if (otp) {
      this.emailService.sendEmail(
        email,
        "Verification Code",
        `Your OTP is: ${otp.token}`
      );
    }
    return true;
  }

  async create(userId: number): Promise<Otp> {
    this.validator.validateRequiredFields({ userId });
    const token = Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
    const expiredAt = new Date(new Date().getTime() + this.expirationTime);
    const newOtp = await this.otpRepository.create({
      token: token,
      userId: userId,
      expiredAt: expiredAt,
    });
    return newOtp;
  }

  async update(otp: Otp, entityManager?: EntityManager): Promise<any> {
    const newOtp = await this.otpRepository.update(otp, entityManager);
  }

  async checkToken(token: number): Promise<Otp> {
    this.validator.validateRequiredFields({ token });
    const otpRecord = await this.otpRepository.getOtpByToken(token);
    if (!otpRecord) throw new StatusError(404, "Code is invalid");

    if (otpRecord.verified) throw new StatusError(400, "Code is invalid");

    if (new Date() > new Date(otpRecord.expiredAt.toString()))
      throw new StatusError(500, "Code is invalid");

    return otpRecord;
  }

  async verify(token: number): Promise<User> {
    const otpRecord = await this.checkToken(token);

    const userRecord = await this.userRepository.findById(otpRecord.userId);
    if (!userRecord) throw new StatusError(404, "User not found");

    if (userRecord.isDeleted) throw new StatusError(404, "Account is deleted");
    if (userRecord.isActive)
      throw new StatusError(404, "Account is already active");

    otpRecord.verified = true;
    userRecord.isActive = true;

    await (
      await connectToDatabase()
    ).transaction(async (transactionalEntityManager) => {
      
      await this.userRepository.updateUser(
        userRecord,
        transactionalEntityManager
      );
      await this.otpRepository.update(otpRecord, transactionalEntityManager);
    });
    return userRecord;
  }
}
export default OtpService;
