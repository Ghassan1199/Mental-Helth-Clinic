import { Wallet } from "../../../../domain/entities/Wallet";
import { connectToDatabase } from "../../";
import { DataSource, EntityManager } from "typeorm";
import { Transaction } from "../../../../domain/entities/Transaction";
import { Clinic } from "../../../../domain/entities/Clinic";
import { IClinicRepository } from "../../../../domain/interfaces/repositories/IClinicRepository";
import { User } from "../../../../domain/entities/User";
import { SessionInfo } from "../../../../domain/entities/SessionInfo";

export class ClinicMysqlRepository implements IClinicRepository {
  private client!: DataSource;

  constructor() {
    this.init();
  }
  private async init() {
    this.client = await connectToDatabase();
  }

  async getAllDoctors(): Promise<any[]> {
    return await this.client
      .getRepository(User)
      .createQueryBuilder("specialist")
      .leftJoinAndSelect("specialist.specialistProfile", "profile")
      .leftJoinAndSelect("specialist.clinic", "clinic")
      .leftJoinAndSelect("clinic.city", "city")
      .where("specialist.roleId = :roleId", { roleId: process.env.DOCTOR })
      .andWhere("profile.status = :status", { status: "verified" })
      .select([
        "specialist.id",
        "profile.fullName",
        "profile.photo",
        "clinic.id",
        "city.name",
      ])
      .getMany();
  }

  async getProfile(doctorId: number): Promise<any> {
    return await this.client
      .getRepository(User)
      .createQueryBuilder("specialist")
      .leftJoinAndSelect("specialist.specialistProfile", "profile")
      .leftJoinAndSelect("specialist.clinic", "clinic")
      .leftJoinAndSelect("clinic.city", "city")
      .where("specialist.roleId = :roleId", { roleId: process.env.DOCTOR })
      .andWhere("specialist.id = :id", { id: doctorId })
      .andWhere("profile.status = :status", { status: "verified" })
      .select([
        "specialist.id",
        "profile.fullName",
        "profile.photo",
        "profile.studyInfo",
        "profile.specInfo",
        "clinic.id",
        "clinic.address",
        "city.name"

      ])
      .getOne();
  }

  async create(
    name: string,
    doctorId: number,
    cityId: number,
    longitude: string,
    latitude: string,
    address: string,
    entityManager?: EntityManager
  ): Promise<Clinic> {
    if (entityManager)
      return await entityManager.save(Clinic, {
        name,
        doctorId,
        cityId,
        longitude,
        latitude,
        address,
      });
    return await this.client
      .getRepository(Clinic)
      .save({ name, doctorId, cityId, longitude, latitude, address });
  }

  async findById(id: number): Promise<Clinic | null> {
    const repository = this.client.getRepository(Clinic);
    const clinic = await repository.findOne({
      where: { id: id },
      relations: ["doctor"],
    });
    return clinic || null;
  }

  async findByOwner(user: User): Promise<Clinic | null> {
    const repository = this.client.getRepository(Clinic);
    const clinic = await repository.findOne({ where: { doctor: user } });
    return clinic || null;
  }

  async update(
    record: Clinic,
    entityManager?: EntityManager
  ): Promise<Clinic | null> {
    if (entityManager) return await entityManager.save(Clinic, record);
    return await this.client.getRepository(Clinic).save(record);
  }

  async findAll(): Promise<Clinic[]> {
    const repository = this.client.getRepository(Clinic);
    const clinics = await repository.find();
    return clinics;
  }
}
