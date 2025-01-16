import { User as Specialist } from "../../../../../domain/entities/User";
import { connectToDatabase } from "../../../";
import { ISpecialistRepository } from "../../../../../domain/interfaces/repositories/specs/ISpecialist.repository";
import {
  Brackets,
  DataSource,
  EntityManager,
  In,
} from "typeorm";
import { Clinic } from "../../../../../domain/entities/Clinic";
import { Employee } from "../../../../../domain/entities/Employee";
import { WithdrawSpecialistRequest } from "../../../../../domain/entities/WithdrawSpecialistRequest";
import { EmployeeRequest } from "../../../../../domain/entities/EmployeeRequest";
import env from "dotenv";
import { UserProfile } from "../../../../../domain/entities/UserProfile";
env.config();
export class SpecialistMysqlRepository implements ISpecialistRepository {
  private client!: DataSource;

  constructor() {
    this.init();
  }


  private async init() {
    this.client = await connectToDatabase();
  }

  async findPatientProfile(user: Specialist): Promise<UserProfile | null> {
    return this.client.getRepository(UserProfile).findOne({
      where: {
        user,
      },
      relations: ["user", "user.botScore"],
    });
  }
  async removeEmployee(clinicId: number, userId: number): Promise<void> {
    await this.client.getRepository(Employee).delete({ userId, clinicId });
  }

  async deleteUsers(where: {}): Promise<void> {
    await this.client.getRepository(Specialist).delete(where);
  }

  async deleteEmploymentRequest(id: number): Promise<void> {
    await this.client.getRepository(EmployeeRequest).delete({
      id,
    });
  }

  async getAllSpecialistsNE(clinicId: number): Promise<any> {
    return await this.client
      .getRepository(Specialist)
      .createQueryBuilder("specialist")
      .leftJoinAndSelect("specialist.specialistProfile", "profile")
      .leftJoinAndSelect("specialist.employee", "employee")
      .leftJoin(                
        "specialist.employmentRequests",
        "employmentRequests",
        "employmentRequests.id = (SELECT MAX(id) FROM employeeRequests WHERE userId = specialist.id AND status IS NULL)",
        { clinicId }  
      )
      .where("specialist.roleId = :roleId", { roleId: process.env.SPECIALIST })
      .andWhere("specialist.isActive = :isActive", { isActive: true })
      .andWhere("profile.status = :status", { status: "verified" })
      .andWhere(
        new Brackets((qb) => {
          qb.where("employee.clinicId IS NULL").orWhere(
            "employee.clinicId != :clinicId",   
            { clinicId }  
          );
        })
      )
      .select([
        "specialist.id",    
        "profile.id",
        "profile.fullName",
        "profile.photo",
        "profile.studyInfo",
        "profile.specInfo",
        "employmentRequests.id",
        "employmentRequests.status",
      ])
      .getMany();
  }

  async getSpecialistsByNameNE(
    name: string,
    roleId: number,
    clinicId: number
  ): Promise<object[]> {
    return await this.client
      .getRepository(Specialist)
      .createQueryBuilder("specialist")
      .leftJoinAndSelect("specialist.specialistProfile", "profile")
      .leftJoinAndSelect("specialist.employee", "employee")
      .leftJoin(
        "specialist.employmentRequests",
        "employmentRequests",
        "employmentRequests.id = (SELECT MAX(id) FROM employeeRequests WHERE userId = specialist.id AND clinicId = :clinicId AND status != true)",
        { clinicId }
      )
      .where("LOWER(profile.fullName) LIKE LOWER(:name)", { name: `%${name}%` })
      .andWhere("specialist.roleId = :roleId", { roleId })
      .andWhere("specialist.isActive = :isActive", { isActive: true })
      .andWhere("profile.status = :status", { status: "verified" })
      .andWhere(
        new Brackets((qb) => {
          qb.where("employee.clinicId IS NULL").orWhere(
            "employee.clinicId != :clinicId",
            { clinicId }
          );
        })
      )
      .select([
        "specialist.id",
        "profile.id",
        "profile.fullName",
        "profile.photo",
        "profile.studyInfo",
        "profile.specInfo",
        "employmentRequests.id",
        "employmentRequests.status",
      ])
      .getMany();
  }
  async getEmployees(clinicId: number): Promise<Specialist[]> {
    return await this.client
      .getRepository(Specialist)
      .createQueryBuilder("specialist")
      .leftJoin("specialist.specialistProfile", "profile")
      .leftJoinAndSelect("specialist.employee", "employee")
      .leftJoinAndSelect("specialist.specAssignments", "assignments")
      .where("specialist.roleId = :roleId", { roleId: process.env.SPECIALIST })
      .andWhere("specialist.isActive = :isActive", { isActive: true })
      .andWhere("employee.clinicId = :clinicId", { clinicId })
      .select([
        "specialist.id",
        "profile.id",
        "profile.fullName",
        "profile.photo",
        "profile.studyInfo",
        "profile.specInfo",
        "assignments",
      ])
      .getMany();
  }

  async getEmployee(
    clinicId: number,
    userId: number
  ): Promise<Employee | null> {
    const repository = this.client.getRepository(Employee);
    return await repository.findOne({ where: { clinicId, userId } });
  }

  async getSpec(): Promise<Specialist[] | null> {
    const repository = this.client.getRepository(Specialist);
    return await repository.find({
      where: { isActive: true, roleId: In([1, 2]), specialistProfile: {status: "verified"} },
      relations: [
        "specialistProfile",
        "specialistProfile.specialistCategories.category",
        "wallet",
        "clinic.employees.user.specialistProfile",
        "clinic.employees.user.specialistProfile.specialistCategories.category",
        "clinic.city",
      ],
      select: {
       id: true,
          username: true,
          email: true,
          password: false,
          isActive: true,
          isBlocked: true,
          blockCounter: true,
          blockedUntil: true,
          alertCounter: true,
          isDeleted: true,
          deletedAt: true,
          roleId: true,
          deviceToken: true,
          
      },  
    });
  }

  async countUsers(): Promise<number> {
    const repository = this.client.getRepository(Specialist);
    return await repository.count({
      where: {
        isActive: true,
        roleId: 0,
      },
    });
  }

  async createWithdrawRequest(
    specialistId: number,
    amount: number,
    balance: number
  ): Promise<void> {
    const repository = this.client.getRepository(WithdrawSpecialistRequest);
    const request = repository.create({
      specialistId,
      amount,
      balance,
      date: new Date(),
    });
    await repository.save(request);
  }

  async getAllWithdrawRequests(
    specialistId: number
  ): Promise<WithdrawSpecialistRequest[]> {
    const repository = this.client.getRepository(WithdrawSpecialistRequest);

    return await repository.find({
      where: {
        specialistId,

      },
      order: {
        id: "DESC",
      },
      relations: ["withdrawSpecialistTransaction.withdrawSpecialistApprovement"],
    });
  }
  async showWithdrawRequest(where: {}): Promise<WithdrawSpecialistRequest | null> {
    const repository = this.client.getRepository(WithdrawSpecialistRequest);
    return await repository.findOne({
      where,
    });
  }

  async createEmployeeRequest(clinicId: number, userId: number): Promise<void> {
    const repository = this.client.getRepository(EmployeeRequest);
    const employeeRequest = repository.create({
      clinicId,
      userId,
      date: new Date(),
    });
    await repository.save(employeeRequest);
  }

  async addEmployee(
    clinicId: number,
    userId: number,
    entityManager?: EntityManager
  ): Promise<void> {
    if (entityManager) {
      await entityManager.save(Employee, {
        clinicId,
        userId,
        date: new Date(),
      });
    } else {
      const repository = this.client.getRepository(Employee);
      const employee = repository.create({
        clinicId,
        userId,
        date: new Date(),
      });
      await repository.save(employee);
    }
  }

  async updateEmploymentRequest(
    record: EmployeeRequest,
    entityManager?: EntityManager
  ): Promise<void> {
    if (entityManager) {
      await entityManager.save(EmployeeRequest, record);
    } else {
      const repository = this.client.getRepository(EmployeeRequest);
      await repository.save(record);
    }
  }

  async getEmploymentRequests(where: any = {}): Promise<EmployeeRequest[]> {
    const repository = this.client.getRepository(EmployeeRequest);
    return repository.find({
      where,
      order: {
        id: "DESC",
      },
    });
  }

  async getEmploymentRequestsByUserId(userId: number): Promise<any[]> {
    const requests = await this.client
      .getRepository(EmployeeRequest)
      .createQueryBuilder("employeeRequest")
      .leftJoinAndSelect("employeeRequest.clinic", "clinic")
      .leftJoinAndSelect("clinic.doctor", "doctor")
      .leftJoinAndSelect("doctor.specialistProfile", "specialistProfile")
      .where(
        "employeeRequest.userId = :userId AND employeeRequest.status IS NULL",
        { userId }
      )
      .select([
        "employeeRequest.id",
        "employeeRequest.date",
        "employeeRequest.userId",
        "employeeRequest.status",
        "clinic.name",
        "doctor.id",
        "specialistProfile.fullName",
      ])
      .orderBy("employeeRequest.id", "DESC")
      .getMany();

    const reqs = [];
    for (const request of requests) {
      reqs.push({
        clinicName: request?.clinic.name,
        doctorName: request?.clinic.doctor.specialistProfile?.fullName,
        data: request?.date,
        userId: request?.userId,
        status: request?.status,
        id: request?.id,
      });
    }

    return reqs;
  }

  async getEmploymentRequestsByClinicId(clinicId: number): Promise<any[]> {
    const requests = await this.client
      .getRepository(EmployeeRequest)
      .createQueryBuilder("employeeRequest")
      .leftJoinAndSelect("employeeRequest.clinic", "clinic")
      .leftJoinAndSelect("clinic.doctor", "doctor")
      .leftJoinAndSelect("doctor.specialistProfile", "specialistProfile")
      .where("employeeRequest.clinicId = :clinicId", { clinicId })
      .select([
        "employeeRequest.id",
        "employeeRequest.date",
        "employeeRequest.userId",
        "employeeRequest.status",
        "clinic.name",
        "doctor.id",
        "specialistProfile.fullName",
      ])
      .orderBy("employeeRequest.id", "DESC")
      .getMany();

    const reqs = [];
    for (const request of requests) {
      reqs.push({
        clinicName: request?.clinic.name,
        doctorName: request?.clinic.doctor.specialistProfile?.fullName,
        data: request?.date,
        userId: request?.userId,
        status: request?.status,
        id: request?.id,
      });
    }

    return reqs;
  }

  async getEmploymentRequest(requestId: number): Promise<any | null> {
    const request = await this.client
      .getRepository(EmployeeRequest)
      .createQueryBuilder("employeeRequest")
      .leftJoinAndSelect("employeeRequest.clinic", "clinic")
      .leftJoinAndSelect("clinic.doctor", "doctor")
      .leftJoinAndSelect("doctor.specialistProfile", "specialistProfile")
      .where("employeeRequest.id = :requestId", { requestId })
      .select([
        "employeeRequest.id",
        "employeeRequest.date",
        "employeeRequest.userId",
        "employeeRequest.status",
        "clinic.name",
        "doctor.id",
        "specialistProfile.fullName",
      ])
      .getOne();

      if(request == null) return request;
    return {
      clinicName: request.clinic.name,
      doctorName: request.clinic.doctor.specialistProfile?.fullName,
      data: request.date,
      userId: request.userId,
      status: request.status,
      id: request.id,
    };
  }

  async showEmploymentRequest(
    requestId: number
  ): Promise<EmployeeRequest | null> {
    const repository = this.client.getRepository(EmployeeRequest);
    return repository.findOne({
      where: {
        id: requestId,
      },
      relations: ["clinic", "clinic.doctor"]
    });
  }
  async getClinicBySpecId(doctorId: number): Promise<Clinic | null> {
    const repository = this.client.getRepository(Clinic);
    const clinic = await repository.findOneBy({ doctorId });
    return clinic;
  }

  async create(
    email: string,
    password: string,
    roleId: number,
    deviceToken:string,
    entityManager: EntityManager
  ): Promise<Specialist> {
    const record = entityManager.create(Specialist, {
      email,
      password,
      roleId,
      deviceToken,
    });
    const savedSpec = await entityManager.save(record);
    return savedSpec;
  }

  async findById(id: number): Promise<Specialist | null> {
    const repository = this.client.getRepository(Specialist);
    const spec = await repository.findOne({
      where: { id: id },
      relations: ["wallet"],
    });
    return spec || null;
  }

  async findByEmail(email: string): Promise<Specialist | null> {
    const repository = this.client.getRepository(Specialist);
    const spec = await repository.findOneBy({ email });
    return spec;
  }
  async update(
    specialist: Specialist,
    entityManager?: EntityManager
  ): Promise<Specialist> {
    if (entityManager) return await entityManager.save(Specialist, specialist);

    return await this.client.getRepository(Specialist).save(specialist);
  }

  async getClinicsForTherapist(therapistId: number): Promise<any> {
   return await this.client.getRepository(Employee).find({
      where:{

        userId: therapistId
      },
      relations: ["clinic"]
    });
  }

  async getDocsBySpecialization(specializationId: number): Promise<Specialist[]> {
    return await this.client.getRepository(Specialist).find(      {
      where: {
        roleId: Number(process.env.DOCTOR),
        specialistProfile: {
          specialistCategories: {
            category: {
              id: specializationId
            },
            
          },
        status: "verified"
        }
      },
      relations: ['specialistProfile', 'clinic.city']
    });
  }
}
