import { connectToDatabase } from "../../..";
import { DataSource, EntityManager } from "typeorm";
import { ISpecialistProfileRepository } from "../../../../../domain/interfaces/repositories/specs/IProfile.Repository";
import { SpecialistProfile } from "../../../../../domain/entities/SpecialistProfile";

export class SpecialistProfileMysqlRepository
  implements ISpecialistProfileRepository
{
  private client!: DataSource;

  constructor() {
    this.init();
  }

  private async init() {
    this.client = await connectToDatabase();
  }

  async create(
    input: any,
    entityManager: EntityManager
  ): Promise<SpecialistProfile> {
    const { dateOfBirth, gender, phone, fullName, photo, status, userId } =
      input;
    const record = entityManager.create(SpecialistProfile, {
      dateOfBirth: dateOfBirth,
      gender: gender,
      phone: phone,
      fullName: fullName,
      photo: photo,
      status: status,
      userId: userId,
    });

    const savedProfile = await entityManager.save(record);

    return savedProfile;
  }

  async getByUserId(
    userId: number,
    select: {} = {}
  ): Promise<SpecialistProfile | null> {
    const repository = this.client.getRepository(SpecialistProfile);
    const record = await repository.findOne({
      where: {
        userId: userId,
      },
      select,
    });
    return record;
  }

  async update(profile: SpecialistProfile, entityManager?: EntityManager) {
    if (entityManager)
      return await entityManager.save(SpecialistProfile, profile);
    const repository = this.client.getRepository(SpecialistProfile);
    return await repository.save(profile);
  }
}
