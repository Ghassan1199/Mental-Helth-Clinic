import { EntityManager, FindOptions } from "typeorm";
import { User as Specialist } from "../../../entities/User";
import { Clinic } from "../../../entities/Clinic";
import { Employee } from "../../../entities/Employee";
import { EmployeeRequest } from "../../../entities/EmployeeRequest";
import { WithdrawSpecialistRequest } from "../../../entities/WithdrawSpecialistRequest";
import { UserProfile } from "../../../entities/UserProfile";

export interface ISpecialistRepository {
  create(
    email: string,
    password: string,
    roleId: number,
    deviceToken:string,
    entityManager: EntityManager
  ): Promise<Specialist>;
  findByEmail(email: string): Promise<Specialist | null>;
  findById(id: number): Promise<Specialist | null>;
  update(
    specialist: Specialist,
    entityManager?: EntityManager
  ): Promise<Specialist>;
  getClinicBySpecId(doctorId: number): Promise<Clinic | null>;
  createEmployeeRequest(clinicId: number, userId: number): Promise<void>;
  createWithdrawRequest(specialistId: number, amount: number, balance: number): Promise<void>;
  getAllWithdrawRequests(
    specialistId: number
  ): Promise<WithdrawSpecialistRequest[]>;
  showWithdrawRequest(where: {}): Promise<WithdrawSpecialistRequest | null>;
  getEmployee(clinicId: number, userId: number): Promise<Employee | null>;
  getEmploymentRequests(where: any): Promise<EmployeeRequest[]>;
  getEmploymentRequest(requestId: number): Promise<any | null>;
  updateEmploymentRequest(
    record: EmployeeRequest,
    entityManager?: EntityManager
  ): Promise<void>;
  addEmployee(
    clinicId: number,
    userId: number,
    entityManager?: EntityManager
  ): Promise<void>;
  getEmployees(clinicId: number): Promise<Specialist[]>;
  getSpecialistsByNameNE(
    name: string,
    roleId: number,
    clinicId: number
  ): Promise<object[]>;
  getAllSpecialistsNE(clinicId: number): Promise<Specialist[]>;
  deleteUsers(where: {}): Promise<void>;
  removeEmployee(clinicId: number, userId: number): Promise<void>;
  getEmploymentRequestsByClinicId(clinicId: number): Promise<any[]>;
  getEmploymentRequestsByUserId(userId: number): Promise<any[]>;
  deleteEmploymentRequest(id: number): Promise<void>;
  showEmploymentRequest(requestId: number): Promise<EmployeeRequest | null>;
  findPatientProfile(user: Specialist): Promise<UserProfile | null>;
  getSpec(): Promise<Specialist[] | null>;
  countUsers(): Promise<number>;
  getClinicsForTherapist(therapistId: number): Promise<any>;
  getDocsBySpecialization(specializationId: number): Promise<Specialist[]>;

}
