import { EntityManager } from "typeorm";
import { Wallet } from "../../entities/Wallet";
import { RedeemCode } from "../../entities/RedeemCode";
import { RedeemTransaction } from "../../entities/RedeemTransaction";

export interface IRedeemTransactionRepository {
  create(
    redeemCode: RedeemCode,
    wallet: Wallet,
    amount: number,
    entityManager: EntityManager
  ): Promise<RedeemTransaction>;

  findById(id: number): Promise<RedeemTransaction | null>;
  getAll(): Promise<RedeemTransaction[]>;
  getRedeemTransactionsHistory(wallet: Wallet): Promise<RedeemTransaction[]>;
}
