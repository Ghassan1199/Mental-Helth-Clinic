import { EntityManager } from "typeorm";
import { User } from "../../entities/User";
import { OAuth } from "../../entities/OAuth";

export interface IOAuthRepository {
  create(
    accessToken: string,
    refreshToken: string,
    user: User,
    entityManager?: EntityManager
  ): Promise<OAuth>;
  findById(oAuthId: any): Promise<OAuth | null>;
  findByUser(user: User): Promise<OAuth | null>;
  update(oAuth: OAuth, entityManager?: EntityManager): Promise<OAuth | null>;
}
