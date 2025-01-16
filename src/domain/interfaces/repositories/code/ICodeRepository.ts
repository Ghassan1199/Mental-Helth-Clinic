import { EntityManager } from "typeorm/entity-manager/EntityManager";
import { RedeemCode } from "../../../entities/RedeemCode";

export interface ICodeRepository {
  create(code: string, amount: number, entityManager?: EntityManager): Promise<RedeemCode>;
  getAll(): Promise<RedeemCode[]>;
  getCode(code: string): Promise<RedeemCode | null>;
  update(record: RedeemCode, entityManager?: EntityManager): Promise<RedeemCode | null>;

}
