import { inject, injectable } from "tsyringe";
import { Otp } from "../../../domain/entities/Otp";
import { User } from "../../../domain/entities/User";
import { IUserProfileRepository } from "../../../domain/interfaces/repositories/IUserProfileRepository";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { connectToDatabase } from "../../../infrastructure/database";
import StatusError from "../../utils/error";
import { EmailService } from "../Email.Service";
import { OtpService } from "../Otp.Service";
import { WalletService } from "../Wallet.Service";
import JwtService from "../jwt.Service";
import bcrypt from "bcrypt";
import { IOAuthRepository } from "../../../domain/interfaces/repositories/IOAuthRepository";
import { NotificationService } from "../Notification.Service";
@injectable()
export class UserService {
  private userRepository!: IUserRepository;
  private oAuthRepository!: IOAuthRepository;
  private profileRepository!: IUserProfileRepository;
  private emailService!: EmailService;
  private otpService!: OtpService;
  private jwtService!: JwtService;
  private walletService!: WalletService;
  private notificationService!: NotificationService;

  constructor(
    @inject("IUserRepository") userRepository: IUserRepository,
    @inject("IOAuthRepository") oAuthRepository: IOAuthRepository,
    @inject("IUserProfileRepository") profileRepository: IUserProfileRepository,
    @inject(OtpService) otpService: OtpService,
    @inject(EmailService) emailService: EmailService,
    @inject(JwtService) jwtService: JwtService,
    @inject(WalletService) walletService: WalletService,
    @inject(NotificationService) notificationService: NotificationService
  ) {
    this.userRepository = userRepository;
    this.oAuthRepository = oAuthRepository;
    this.profileRepository = profileRepository;
    this.otpService = otpService;
    this.emailService = emailService;
    this.jwtService = jwtService;
    this.walletService = walletService;
    this.notificationService = notificationService;
  }

  async register(input: any): Promise<User> {
    let newUser;
    let otp: Otp | undefined;

    await (
      await connectToDatabase()
    ).transaction(async (transactionalEntityManager) => {
      newUser = (await this.userRepository.register(
        input,
        transactionalEntityManager
      )) as any;
      input.userId = newUser.id;
      await this.profileRepository.create(input, transactionalEntityManager);
      await this.walletService.create(newUser, transactionalEntityManager);
    });
    otp = await this.otpService.create(newUser!.id);
    if (otp) {
      this.emailService.sendEmail(
        newUser!.email,
        "email Verification",
        `Your OTP is: ${otp.token}`
      );
    }

    return newUser!;
  }

  async login(input: any): Promise<any> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) throw new StatusError(404, "User not found");
    const isMatch = await user.comparePassword(input.password);
    if (!isMatch) {
      throw new StatusError(400, "Invalid password");
    }
    if (!user.isActive) {
      throw new StatusError(400, "Email not verified");
    }
    if (user.isDeleted) {
      throw new StatusError(403, "Your account is deleted.");
    }
    if (user.deviceToken !== input.deviceToken) {
      await this.notificationService.create("8","new login!" , "someone logged in from another device, this session expired." , user);
    }
    user.deviceToken = input.deviceToken;
    await this.userRepository.updateUser(user);

    const accessToken = await this.jwtService.generateAccessToken(user.id);
    const refreshToken = await this.jwtService.generateRefreshToken(user.id);
    let oAuthRecord = await this.oAuthRepository.findByUser(user);
    if (oAuthRecord) {
      oAuthRecord.accessToken = accessToken;
      oAuthRecord.refreshToken = refreshToken;
      await this.oAuthRepository.update(oAuthRecord);
    } else {
      await this.oAuthRepository.create(accessToken, refreshToken, user);
    }
    const balance = user.wallet?.balance;
    const name = user.userProfile?.fullName;

    return { name, accessToken, refreshToken, balance, id:user.id };
  }

  async getUser(userId: number): Promise<User | null> {
    const user = this.userRepository.findById(userId);
    if (!user) throw new StatusError(404, "User not found");
    return user;
  }

  async checkEmail(email: string): Promise<Boolean> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new StatusError(404, "User not found");
    return user.isActive;
  }

  async resetPassword(user: User, oldPassword: string, newPassword: string) {
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      throw new StatusError(400, "Invalid password");
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await this.userRepository.updateUser(user);
  }

  async forgotPassword(newPassword: string, token: string) {
    const otpRecord = this.otpService.checkToken(Number(token));
    await otpRecord;

    const user = await this.userRepository.findById((await otpRecord).userId);

    if (!user) throw new StatusError(404, "User not found.");

    user.password = await bcrypt.hash(newPassword, 10);

    (await otpRecord).verified = true;

    await (
      await connectToDatabase()
    ).transaction(async (transactionalEntityManager) => {
      await this.userRepository.updateUser(user, transactionalEntityManager);
      await this.otpService.update(await otpRecord, transactionalEntityManager);
    });
    return user;
  }
}
