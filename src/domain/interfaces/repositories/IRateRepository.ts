import { EntityManager } from "typeorm";
import { Rate } from "../../entities/Rate";
import { Clinic } from "../../entities/Clinic";
import { User } from "../../entities/User";

export interface IRateRepository {
    create(clinic: Clinic, user: User, value: number): Promise<Rate>;
    getAverageRateByClinic(clinic: Clinic): Promise<number>;
    
}
