import { EntityManager } from "typeorm";
import { Otp } from "../../entities/Otp";

export interface IOtpRepository {
  create(input: any): Promise<Otp>;
  getOtpByToken(token: number): Promise<Otp | null>;
  update(record: Otp, entityManager?: EntityManager): Promise<Otp | null>;
  remove(record: Otp): Promise<void>;
  getOtps(where: any): Promise<Otp[]>;
}
