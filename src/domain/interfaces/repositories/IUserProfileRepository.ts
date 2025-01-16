import { EntityManager } from "typeorm";
import { UserProfile } from "../../entities/UserProfile";

export interface IUserProfileRepository {
    create(input: any, entityManager: EntityManager): Promise<UserProfile>;
}
