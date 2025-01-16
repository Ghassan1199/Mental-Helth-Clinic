import { EntityManager } from "typeorm";
import { SpecialistProfile } from "../../../entities/SpecialistProfile";

export interface ISpecialistProfileRepository {
  create(data: any, entityManager: EntityManager): Promise<SpecialistProfile>;
  getByUserId(userId: number, select?: {}): Promise<SpecialistProfile | null>;
  update(
    profile: SpecialistProfile,
    entityManager?: EntityManager
  ): Promise<SpecialistProfile>;
}
