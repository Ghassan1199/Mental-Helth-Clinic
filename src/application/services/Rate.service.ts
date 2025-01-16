import { inject, injectable } from "tsyringe";
import { Clinic } from "../../domain/entities/Clinic";
import { User } from "../../domain/entities/User";
import { IClinicRepository } from "../../domain/interfaces/repositories/IClinicRepository";
import { IRateRepository } from "../../domain/interfaces/repositories/IRateRepository";
import { connectToDatabase } from "../../infrastructure/database";
@injectable()
export class RateService {
  private rateRepository!: IRateRepository;
  private clinicRepository!: IClinicRepository;

  constructor(
    @inject("IRateRepository") rateRepository: IRateRepository,
    @inject("IClinicRepository") clinicRepository: IClinicRepository
  ) {
    this.rateRepository = rateRepository;
    this.clinicRepository = clinicRepository;
  }

  async create(clinic: Clinic, user: User, value: number): Promise<any> {
    await (
      await connectToDatabase()
    ).transaction(async (transactionalEntityManager) => {
      const newRate = await this.rateRepository.create(clinic, user, value);
      const totalRate = await this.rateRepository.getAverageRateByClinic(
        clinic
      );
      clinic.totalRate = totalRate;
      await this.clinicRepository.update(clinic, transactionalEntityManager);
    });
  }
}
