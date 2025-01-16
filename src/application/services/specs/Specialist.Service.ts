import { ISpecialistProfileRepository } from "../../../domain/interfaces/repositories/specs/IProfile.Repository";
import { ISpecialistRepository } from "../../../domain/interfaces/repositories/specs/ISpecialist.repository";
import StatusError from "../../utils/error";
import { EmailService } from "../Email.Service";
import { OtpService } from "../Otp.Service";
import JwtService from "../jwt.Service";
import bcrypt from "bcrypt";
import Validator from "../../validation/validator";
import { connectToDatabase } from "../../../infrastructure/database";
import { FileData } from "../../../domain/interfaces/utils/AuthenticatedRequest";
import { Otp } from "../../../domain/entities/Otp";
import { User as Specialist, User } from "../../../domain/entities/User";
import { IOtpRepository } from "../../../domain/interfaces/repositories/IOtpRepository";
import { IRegistrationRepository } from "../../../domain/interfaces/repositories/registration/IRegistration.repository";
import { IWalletRepository } from "../../../domain/interfaces/repositories/IWalletRepository";
import { IsNull } from "typeorm";
import { inject, injectable } from "tsyringe";
import { Appointment } from "../../../domain/entities/Appointment";
import { IAppointmentRepository } from "../../../domain/interfaces/repositories/appointment/IAppointmentRepository";
import { IAssignmentRepository } from "../../../domain/interfaces/repositories/assigment/assignmentRepository";
import { ChatService } from "../chat/Chat.Service";
import { uploadToCloudinary } from "../../../presentation/middlewares/handlers/cloudinary.handler";
import { IOAuthRepository } from "../../../domain/interfaces/repositories/IOAuthRepository";
import { NotificationService } from "../Notification.Service";
import { BlockService } from "../block/Block.Service";
import { IBlockingRepository } from "../../../domain/interfaces/repositories/blockings/IblockingRepository";
import { exist } from "joi";
require("dotenv").config();
@injectable()
export class SpecialistService {
  private specialistRepository!: ISpecialistRepository;
  private profileRepository!: ISpecialistProfileRepository;
  private oAuthRepository!: IOAuthRepository;

  private emailService!: EmailService;
  private otpService!: OtpService;
  private jwtService!: JwtService;
  private validator: Validator;
  private otpRepository: IOtpRepository;
  private registrationRepository: IRegistrationRepository;
  private walletRepository!: IWalletRepository;
  private appointmentRepository!: IAppointmentRepository;
  private assignmentRepository!: IAssignmentRepository;
  private chatService!: ChatService;
  private notificationService!: NotificationService;
  private blockRepo!: IBlockingRepository;

  constructor(
    @inject("ISpecialistRepository")
    specialistRepository: ISpecialistRepository,
    @inject("ISpecialistProfileRepository")
    profileRepository: ISpecialistProfileRepository,
    @inject(OtpService) otpService: OtpService,
    @inject(EmailService) emailService: EmailService,
    @inject(JwtService) jwtService: JwtService,
    @inject(Validator) validator: Validator,
    @inject("IOtpRepository") otpRepository: IOtpRepository,
    @inject("IRegistrationRepository")
    registrationRepository: IRegistrationRepository,
    @inject("IWalletRepository") walletRepository: IWalletRepository,
    @inject("IAppointmentRepository")
    appointmentRepository: IAppointmentRepository,
    @inject("IOAuthRepository") oAuthRepository: IOAuthRepository,

    @inject("IAssignmentRepository")
    assignmentRepository: IAssignmentRepository,
    @inject(ChatService)
    chatService: ChatService,
    @inject(NotificationService) notificationService: NotificationService,
    @inject("IBlockingRepository") blockRepo: IBlockingRepository

  ) {
    this.specialistRepository = specialistRepository;
    this.profileRepository = profileRepository;
    this.oAuthRepository = oAuthRepository;
    this.otpService = otpService;
    this.emailService = emailService;
    this.jwtService = jwtService;
    this.validator = validator;
    this.otpRepository = otpRepository;
    this.registrationRepository = registrationRepository;
    this.walletRepository = walletRepository;
    this.appointmentRepository = appointmentRepository;
    this.assignmentRepository = assignmentRepository;
    this.chatService = chatService;
    this.notificationService = notificationService;
    this.blockRepo = blockRepo;
  }

  async addMoneyForTestingOnly(specialist: Specialist, amount: number) {
    this.validator.validateRequiredFields({ amount });
    const wallet = await this.walletRepository.findByUser(specialist);
    wallet!.balance += amount;
    await this.walletRepository.update(wallet!);
  }

  async register(input: any, file: FileData): Promise<any> {
    this.validator.registerValidator(input, file);

    const { email, password, roleId, deviceToken } = input;

    const url = await uploadToCloudinary(file.data!, "image", "spec_photos");
    input.photo = url;

    let spec;
    let profile;
    let otp: Otp | undefined;

    await (
      await connectToDatabase()
    ).transaction(async (transactionalEntityManager) => {
      spec = (await this.specialistRepository.create(
        email,
        password,
        roleId,
        deviceToken,
        transactionalEntityManager
      )) as any;

      input.userId = spec.id;
      profile = await this.profileRepository.create(
        input,
        transactionalEntityManager
      );

      await this.walletRepository.create(spec, transactionalEntityManager);
    });
    spec!.profile = profile;
    otp = await this.otpService.create(spec!.id);
    if (otp) {
      this.emailService.sendEmail(
        email,
        "email Verification",
        `Your OTP is: ${otp.token}`
      );
    }

    return spec!;
  }

  async login(input: any): Promise<any> {
    const { email, password, deviceToken } = input;

    this.validator.loginValidator(email, password, deviceToken);

    const spec = await this.specialistRepository.findByEmail(email);

    if (!spec) {
      throw new StatusError(401, "Invalid credentials.");
    }

    const passwordMatch = await bcrypt.compare(password, spec.password);
    if (!passwordMatch) {
      throw new StatusError(401, "Invalid credentials.");
    }

    if (!spec.isActive) {
      throw new StatusError(403, "Activate your account.");
    }

    if (spec.isBlocked) {
      throw new StatusError(403, "Your account is blocked.");
    }

    if (spec.isDeleted) {
      spec.isDeleted = false;
      spec.deletedAt = null;
      await this.specialistRepository.update(spec);
    }
        if (spec.deviceToken !== input.deviceToken) {
      await this.notificationService.create("8","new login!" , "someone logged in from another device, this session expired." , spec);
    }

    spec.deviceToken = deviceToken;
    await this.specialistRepository.update(spec);

    const accessToken = await this.jwtService.generateAccessToken(spec.id);
    const refreshToken = await this.jwtService.generateRefreshToken(spec.id);

    let oAuthRecord = await this.oAuthRepository.findByUser(spec);
    if (oAuthRecord) {
      oAuthRecord.accessToken = accessToken;
      oAuthRecord.refreshToken = refreshToken;
      await this.oAuthRepository.update(oAuthRecord);
    } else {
      await this.oAuthRepository.create(accessToken, refreshToken, spec);
    }

    return {
      id: spec.id,
      roleId: spec.roleId,
      email: spec.email,
      accessToken,
      refreshToken,
    };
  }

  async resetPassword(
    specialist: Specialist,
    oldPassword: string,
    newPassword: string
  ) {
    this.validator.validateRequiredFields({
      specialist,
      oldPassword,
      newPassword,
    });

    const passwordMatch = bcrypt.compare(oldPassword, specialist.password);

    const check = this.validator.isValidPassword(newPassword);

    if (!check) throw new StatusError(400, "Invalid Password Format.");

    if (!(await passwordMatch)) {
      throw new StatusError(401, "Wrong password.");
    }

    specialist.password = await bcrypt.hash(newPassword, 10);

    await this.specialistRepository.update(specialist);
  }

  async forgotPassword(newPassword: string, token: string) {
    this.validator.validateRequiredFields({ newPassword });

    const otpRecord = this.otpService.checkToken(Number(token));

    const check = this.validator.isValidPassword(newPassword);

    await otpRecord;

    const specialist = await this.specialistRepository.findById(
      (
        await otpRecord
      ).userId
    );

    if (!specialist) throw new StatusError(404, "User not found.");

    if (!check) throw new StatusError(400, "Invalid Password Format.");

    specialist.password = await bcrypt.hash(newPassword, 10);

    (await otpRecord).verified = true;

    await (
      await connectToDatabase()
    ).transaction(async (transactionalEntityManager) => {
      await this.specialistRepository.update(
        specialist,
        transactionalEntityManager
      );
      await this.otpRepository.update(
        await otpRecord,
        transactionalEntityManager
      );
    });
  }

  async getUser(userId: number): Promise<Specialist | null> {
    const user = this.specialistRepository.findById(userId);
    if (!user) throw new StatusError(404, "User not found");
    return user;
  }
  async getSpec(): Promise<Specialist[] | null> {
    const user = this.specialistRepository.getSpec();
    if (!user) throw new StatusError(404, "User not found");
    return user;
  }

  async countUsers(): Promise<any> {
    const user = this.specialistRepository.countUsers();
    return user;
  }

  async remove(specialist: Specialist): Promise<Specialist> {
    specialist.isDeleted = true;
    specialist.deletedAt = new Date();
    this.emailService.sendEmail(
      specialist.email,
      "Delete Account",
      `Your account will be deleted within 15 days.
      if you want to restore it, you have to log in before this time period expires`
    );
    return await this.specialistRepository.update(specialist);
  }

  async clinicRegistrationRequest(
    specialist: Specialist,
    latitude: string,
    longitude: string,
    clinicName: string,
    categories: number[],
    cityId: number,
    address: string,
    files: FileData[]
  ) {
    const profile = await this.profileRepository.getByUserId(specialist.id);
    if (profile!.status == "verified")
      throw new StatusError(400, "your account is already verified.");
    if (profile!.status == "pending")
      throw new StatusError(
        400,
        "Wait for the previous request to be processed."
      );
    const urls: string[] = [];
    for (const file of files) {
      const url = await uploadToCloudinary(file.data!, "image", "docs");
      urls.push(url);
    }

    if (
      specialist.roleId == Number(process.env.DOCTOR) &&
      (latitude == null ||
        longitude == null ||
        clinicName == null ||
        cityId == null ||
        address == null)
    ) {
      throw new StatusError(400, "All fields are required for a doctor");
    }
    await (
      await connectToDatabase()
    ).transaction(async (transactionalEntityManager) => {
      const registrationRequest =
        await this.registrationRepository.createRegistrationRequest(
          specialist.id,
          specialist.roleId,
          latitude,
          longitude,
          clinicName,
          cityId,
          address,
          transactionalEntityManager
        );

      for (const categoryId of categories) {
        await this.registrationRepository.createRegistrationRequestCategory(
          registrationRequest.id,
          categoryId,
          transactionalEntityManager
        );

        profile!.status = "pending";
        await this.profileRepository.update(
          profile!,
          transactionalEntityManager
        );
      }

      for (let index = 0; index < urls.length; index++) {
        let url = urls[index];
        await this.registrationRepository.createRegistrationRequestContent(
          registrationRequest.id,
          url,
          transactionalEntityManager
        );
      }
    });
  }

  async getMyRegistrationRequests(specialist: Specialist) {
    return await this.registrationRepository.getAll(
      { specialistId: specialist.id },
      { id: true, status: true }
    );
  }

  async checkEmail(email: string) {
    this.validator.validateRequiredFields({ email });
    const spec = await this.specialistRepository.findByEmail(email);

    let emailStatus = "Inactive";
    if (!spec) emailStatus = "Not found";
    if (spec?.isActive) emailStatus = "Active";
    return emailStatus;
  }

  async sendAddEmployeeRequest(specialist: Specialist, userId: number) {
    this.validator.validateRequiredFields({ userId });

    if (specialist.roleId != Number(process.env.DOCTOR))
      throw new StatusError(401, "You are not a doctor");
    if (specialist.id == userId)
      throw new StatusError(400, "You can not add your self!!");

    const user = await this.specialistRepository.findById(userId);
    if (!user) throw new StatusError(404, "User not found.");

    if (user.roleId == Number(process.env.USER_ROLE))
      throw new StatusError(400, "You can not add a patient.");

    const clinic = await this.specialistRepository.getClinicBySpecId(
      specialist.id
    );
    if (!clinic) throw new StatusError(404, "Clinic not found.");

    const emp = await this.specialistRepository.getEmployee(clinic.id, userId);
    if (emp) throw new StatusError(404, "Employee already exists.");

    const reqs = await this.specialistRepository.getEmploymentRequests({
      clinicId: clinic.id,
      userId,
      status: IsNull(),
    });
    if (reqs.length != 0)
      throw new StatusError(
        400,
        "Wait for the previous request to be processed."
      );
    await this.specialistRepository.createEmployeeRequest(clinic.id, userId);
 
    await this.notificationService.create("9","employment request", `you have an employment request from clinic ${clinic.name} `, user);

  }


  async addEmployee(
    clinicId: number,
    userId: number,
    transactionalEntityManager?: any
  ) {
    this.validator.validateRequiredFields({ userId });

    const emp = await this.specialistRepository.getEmployee(clinicId, userId);
    if (emp) throw new StatusError(404, "Employee already exists.");

    await this.specialistRepository.addEmployee(
      clinicId,
      userId,
      transactionalEntityManager
    );
  }

  async getEmployees(specialist: Specialist, userId: any) {
    if (specialist.roleId != Number(process.env.DOCTOR))
      throw new StatusError(401, "You are not a doctor");

    const clinic = await this.specialistRepository.getClinicBySpecId(
      specialist.id
    );
    if (!clinic) throw new StatusError(404, "Clinic not found.");
    const emps = await this.specialistRepository.getEmployees(clinic.id);

    let employees: any[] = [];
    if (userId) {
      for (const emp of emps) {
        let status = false;
        if (emp.specAssignments) {
          for (const assignment of emp.specAssignments) {
            if (assignment.userId == Number(userId)) {
              status = true;
            }
          }
        }
        employees.push({
          status,
          ...emp,
        });
      }
    } else {
      employees = emps;
    }

    return employees;
  }

  async getEmploymentRequests(userId: number) {
    this.validator.validateRequiredFields({ userId });

    const requests =
      await this.specialistRepository.getEmploymentRequestsByUserId(userId);

    return requests;
  }

  async getSentEmploymentRequestsByDoc(specialist: Specialist) {
    if (specialist.roleId != Number(process.env.DOCTOR))
      throw new StatusError(401, "You are not a doctor");

    const clinic = await this.specialistRepository.getClinicBySpecId(
      specialist.id
    );
    if (!clinic) throw new StatusError(404, "Clinic not found.");
    const requests =
      await this.specialistRepository.getEmploymentRequestsByClinicId(
        clinic.id
      );

    return requests;
  }
  async showEmploymentRequest(requestId: number) {
    const request = await this.specialistRepository.getEmploymentRequest(
      requestId
    );

    if (!request) throw new StatusError(404, "Request not found");

    return request;
  }

  async handleEmploymentRequest(
    requestId: number,
    status: boolean,
    SpecialistId: number
  ) {
    if (status == undefined) throw new StatusError(400, "status is required");
    this.validator.validateRequiredFields({ requestId });

    const request = await this.specialistRepository.showEmploymentRequest(
      requestId
    );

    if (!request) throw new StatusError(404, "Request not found");

    if (request.userId != SpecialistId)
      throw new StatusError(401, "Unauthorized");

    if (request.status != null)
      throw new StatusError(400, "This request is already handled");
    request.status = status;

    if (status==false){
      await this.specialistRepository.updateEmploymentRequest(request);
    }else {
      await (
        await connectToDatabase()
      ).transaction(async (transactionalEntityManager) => {
        await this.specialistRepository.updateEmploymentRequest(
          request,
          transactionalEntityManager
        );
        await this.addEmployee(
          request.clinicId,
          request.userId,
          transactionalEntityManager
        );
      });
      await this.notificationService.create("10","new employee", `Therapist has accepted your request to join your clinic`, request.clinic.doctor);
    }


  }

  async searchForSpecialist(name: string, specialistId: number) {
    this.validator.validateRequiredFields({ name });
    const clinic = await this.specialistRepository.getClinicBySpecId(
      specialistId
    );
    if (!clinic) throw new StatusError(404, "Clinic not found");
    return await this.specialistRepository.getSpecialistsByNameNE(
      name,
      Number(process.env.SPECIALIST),
      clinic.id
    );
  }

  async getAllSpecialists(specialistId: number) {
    const clinic = await this.specialistRepository.getClinicBySpecId(
      specialistId
    );
    if (!clinic) throw new StatusError(404, "Clinic not found");
    return await this.specialistRepository.getAllSpecialistsNE(clinic.id);
  }

  async withdrawRequest(specialist: User, amount: number) {

    const appos = this.appointmentRepository.findNotComleteBySpec(specialist);
    this.validator.validateRequiredFields({ amount });

    const wallet = await this.walletRepository.findByUser(specialist);
    if (!wallet) throw new StatusError(404, "Wallet not found.");

    let tempBalance = wallet.balance;
    for (const appo of (await appos)){
      tempBalance -= Number(appo.price);
    }

    if (amount > tempBalance) throw new StatusError(400, "You do not have enough balance. Note that the credit of incomplete appointments can not be withdrawn.");

    const req = await this.specialistRepository.showWithdrawRequest({
      specialistId: specialist.id,
      status: IsNull(),
    });
    if (req)
      throw new StatusError(
        400,
        "Wait for the previous request to be processed."
      );
    await this.specialistRepository.createWithdrawRequest(
      specialist.id,
      amount,
      wallet.balance
    );
  }

  async getAllwithdrawRequests(specialistId: number) {
    return await this.specialistRepository.getAllWithdrawRequests(specialistId);
  }

          // async checkUser(specialistId: number) {
          //   return await this.specialistRepository.getAllWithdrawRequests(specialistId);
          // }

  async showWithdrawRequest(id: number) {
    this.validator.validateRequiredFields({ id });
    const req = await this.specialistRepository.showWithdrawRequest({ id });
    if (!req) throw new StatusError(404, "Request not found.");
    return req;
  }

  async removeEmployee(specialistId: number, userId: number) {
    this.validator.validateRequiredFields({ specialistId });
    const clinic = await this.specialistRepository.getClinicBySpecId(
      specialistId
    );
    if (!clinic) throw new StatusError(404, "Clinic not found");
    const employee = await this.specialistRepository.getEmployee(
      clinic.id,
      userId
    );
    if (!employee) throw new StatusError(404, "employee not found");
    return await this.specialistRepository.removeEmployee(clinic.id, userId);
  }

  async getMyBalance(specialist: Specialist) {
    return await this.walletRepository.findByUser(specialist);
  }

  async deleteEmploymentRequest(specialistId: number, requestId: number) {
    this.validator.validateRequiredFields({ requestId });

    const req = await this.specialistRepository.showEmploymentRequest(
      requestId
    );
    if (!req) throw new StatusError(404, "Request not found.");

    const clinic = await this.specialistRepository.getClinicBySpecId(
      specialistId
    );
    if (!clinic) throw new StatusError(404, "Clinic not found.");

    if (req.clinicId != clinic.id) throw new StatusError(400, "Not allowed");
    return await this.specialistRepository.deleteEmploymentRequest(requestId);
  }

  async getPatients(spec: Specialist) {
    let patients = [];
    if (spec.roleId == Number(process.env.DOCTOR)) {
      const data = await this.appointmentRepository.findComleteBySpec(spec);
      const uniquePatientIds = new Set<number>();

      for (const d of data) {
        const block = await this.blockRepo.showBlock(spec.id, d.userId);
        if (block) continue;
        if (!uniquePatientIds.has(d.userId)) {
          uniquePatientIds.add(d.userId);
          patients.push({ id: d.userId, name: d.user.userProfile?.fullName });
        }   
      }
    } else {

      const data = await this.assignmentRepository.findAssignmentsBySpec(
        spec.id
      );
      for (const d of data) {
        const block = await this.blockRepo  .showBlock(spec.id, d.user.id);
        if (block) continue;
        patients.push({ id: d.userId, name: d.user.userProfile?.fullName });
      }
    }

    return patients;
  }

  async assign(doctor: User, userId: number, specId: number) {
    if (doctor.roleId != Number(process.env.DOCTOR))
      throw new StatusError(401, "You are not a doctor");

    const prev = await this.assignmentRepository.findAssignmentByBoth(
      userId,
      specId
    );

    if (prev != null)
      throw new StatusError(
        400,
        "this user is already assigned to the same therapist"
      );  

    const patient = await this.getUser(userId);
    if (!patient) throw new StatusError(404, "Patient not found");
    const spec = await this.getUser(specId);
    if (!spec) throw new StatusError(404, "therapist not found");

    const appo = await this.appointmentRepository.findComleteBySpecAndUser(doctor, patient);
    if(appo == null) throw new StatusError(404, "you have to complete a session before assigning.");

    await (
      await connectToDatabase()
    ).transaction(async (transactionalEntityManager) => {
      await this.chatService.create(patient, spec, transactionalEntityManager);
      await this.assignmentRepository.createAssignment(
        userId,
        specId,
        transactionalEntityManager
      );
    });

    await this.notificationService.create("11","Assignment", `You have been Assigned to a therapist`, patient);
    await this.notificationService.create("11","Assignment", `You have been Assigned to a patient`, spec);
  }




  async unassign(userId: number, specId: number) {

    const prev = await this.assignmentRepository.findAssignmentByBoth(
      userId,
      specId
    );

    if (prev == null)
      throw new StatusError(
        400,
        "this user is not assigned to the this therapist"
      );

    const patient = await this.getUser(userId);
    if (!patient) throw new StatusError(404, "Patient not found");
    const spec = await this.getUser(specId);
    if (!spec) throw new StatusError(404, "therapist not found");

    await (
      await connectToDatabase()
    ).transaction(async (transactionalEntityManager) => {
      await this.chatService.delete(patient, spec, transactionalEntityManager);
      await this.assignmentRepository.deleteAssignment(
        userId,
        specId,
        transactionalEntityManager
      );
    });
  }

  async showPatientProfile(userId: number) {
    const user = await this.getUser(userId);
    if (user == null) throw new StatusError(404, "user not found.");
    const profile = await this.specialistRepository.findPatientProfile(user);
    if (profile == null) throw new StatusError(404, "profile not found.");
    return profile;
  }

  async getClinicsForTherapist(spec: Specialist): Promise<any> {
    if (spec.roleId != Number(process.env.SPECIALIST))
      throw new StatusError(400, "You are not a therapist");
    return await this.specialistRepository.getClinicsForTherapist(spec.id);
  }

  async getClinicForDoctor(spec: Specialist): Promise<any> {
    if (spec.roleId != Number(process.env.DOCTOR))
      throw new StatusError(400, "You are not a doctor");
    const clinic = await this.specialistRepository.getClinicBySpecId(spec.id);
    if (clinic == null) throw new StatusError(404, "clinic not found");
    return clinic;
  }

  async getDocsBySpecialization(specializationId: number): Promise<any> {

    if(!specializationId) throw new StatusError(400, "specializationId is required");
    return await this.specialistRepository.getDocsBySpecialization(specializationId);
  }
}
