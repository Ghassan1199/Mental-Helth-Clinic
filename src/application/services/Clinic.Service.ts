import { EntityManager } from "typeorm";
import { Clinic } from "../../domain/entities/Clinic";
import { Transaction } from "../../domain/entities/Transaction";
import { IClinicRepository } from "../../domain/interfaces/repositories/IClinicRepository";
import StatusError from "../utils/error";
import { User } from "../../domain/entities/User";
import { inject, injectable } from "tsyringe";
import { ISessionInfoRepository } from "../../domain/interfaces/repositories/sessionInfo/ISessionInfo.Repository";


@injectable()
export class ClinicService {
  private clinicRepository!: IClinicRepository;
  private sessionInfoRepository!: ISessionInfoRepository;

  constructor(
    @inject("IClinicRepository")
    clinicRepository: IClinicRepository,
    @inject("ISessionInfoRepository")
    sessionInfoRepository: ISessionInfoRepository
  ) {
    this.clinicRepository = clinicRepository;
    this.sessionInfoRepository = sessionInfoRepository;
  }

  async create(
    clinicName: string,
    doctorId: number,
    cityId: number,
    longitude: string,
    latitude: string,
    address: string,
    entityManager?: EntityManager
  ): Promise<Clinic | any> {
    return await this.clinicRepository.create(
      clinicName,
      doctorId,
      cityId,
      longitude,
      latitude,
      address,
      entityManager
    );
  }

  async index(): Promise<Clinic[]> {
    const clinics = await this.clinicRepository.findAll();
    return clinics;
  }

  async getById(id: any): Promise<Clinic> {
    const clinic = await this.clinicRepository.findById(id);
    if (!clinic) {
      throw new StatusError(404, "clinic not found .");
    }
    return clinic!;
  }

  async getByOwner(user: User): Promise<Clinic> {
    const clinic = await this.clinicRepository.findByOwner(user);
    if (!clinic) {
      throw new StatusError(404, "clinic not found .");
    }
    return clinic!;
  }

  async getDoctors() {
    const data = await this.clinicRepository.getAllDoctors();

    let docs: any[] = [];
    data.map((doc) => {
      docs.push({
        id: doc.id,
        name: doc.specialistProfile.fullName,
        photo: doc.specialistProfile.photo,
        city: doc.clinic.city.name,
      });
    });
    return docs;
  }

  async getDoctorProfile(doctorId: number) {
    const doc = await this.clinicRepository.getProfile(doctorId);
    const s = await this.sessionInfoRepository.get();

    return {
      id: doc.id,
      name: doc.specialistProfile.fullName,
      photo: doc.specialistProfile.photo,
      city: doc.clinic.city.name,
      specializationInfo: doc.specialistProfile.specInfo,
      studyInfo: doc.specialistProfile.studyInfo,
      clinicId: doc.clinic.id,
      address: doc.clinic.address,
      sessionPrice: s[0]?.price,
      sessionTime: s[0]?.time,
    };
  }
}
