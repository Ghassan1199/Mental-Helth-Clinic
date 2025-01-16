import { inject, injectable } from "tsyringe";
import { IAdminRepository } from "../../../domain/interfaces/repositories/admin/IAdminRepository";
import StatusError from "../../utils/error";
import Validator from "../../validation/validator";
import JwtService from "../jwt.Service";
import bcrypt from "bcrypt";

require("dotenv").config();

@injectable()
export class AdminService {
  private validator: Validator;
  private adminRepository: IAdminRepository;
  private jwtService!: JwtService;

  constructor(
    @inject("IAdminRepository") adminRepository: IAdminRepository,
    @inject(Validator) validator: Validator,
    @inject(JwtService) jwtService: JwtService
  ) {
    this.adminRepository = adminRepository;
    this.validator = validator;
    this.jwtService = jwtService;
  }

  async register(
    fullName: string,
    email: string,
    password: string,
    isSuper: boolean
  ) {
    this.validator.validateRequiredFields({
      fullName,
      email,
      password,
      isSuper,
    });   

    const checkPassword = this.validator.isValidPassword(password);
    if(!checkPassword) throw new StatusError(400, "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
    await this.adminRepository.createAdmin(fullName, email, password, isSuper);
  }

  async login(email: string, password: string) {
    this.validator.loginValidator(email, password, "null");

    const admin = await this.adminRepository.getAdminByEmail(email);

    if (!admin) {
      throw new StatusError(401, "Invalid credentials.");
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      throw new StatusError(401, "Invalid credentials.");
    }

    const accessToken = await this.jwtService.generateAccessToken(
      admin.id,
      "admin"
    );

    return {
      id: admin.id,
      email: admin.email,
      accessToken,
    };
  }

  async getAdmin(adminId: number) {
    this.validator.validateRequiredFields({ adminId });

    return await this.adminRepository.getAdminById(adminId);
  }
}
