import { Wallet } from "../../../../domain/entities/Wallet";
import { connectToDatabase } from "../../";
import { DataSource, EntityManager } from "typeorm";
import { ITransactionRepository } from "../../../../domain/interfaces/repositories/ITransactionRepository";
import { Transaction } from "../../../../domain/entities/Transaction";
import { Appointment } from "../../../../domain/entities/Appointment";
import { IRedeemTransactionRepository } from "../../../../domain/interfaces/repositories/IRedeemTransactionRepository";
import { RedeemCode } from "../../../../domain/entities/RedeemCode";
import { RedeemTransaction } from "../../../../domain/entities/RedeemTransaction";

export class RedeemTransactionMysqlRepository
  implements IRedeemTransactionRepository
{
  private client!: DataSource;

  constructor() {
    this.init();
  }

  private async init() {
    this.client = await connectToDatabase();
  }
  async create(
    redeemCode: RedeemCode,
    wallet: Wallet,
    amount: number,
    entityManager: EntityManager
  ): Promise<RedeemTransaction> {
    return await entityManager.save(RedeemTransaction, {
      redeemCode,
      wallet,
      amount,
      date: new Date()
    });
  }

  async findById(id: number): Promise<RedeemTransaction | null> {
    const repository = this.client.getRepository(RedeemTransaction);
    const transaction = await repository.findOneBy({ id: id });
    return transaction || null;
  }

  async getAll(): Promise<RedeemTransaction[]> {
    const repository = this.client.getRepository(RedeemTransaction);
    const transactions = await repository.find();
    return transactions || null;
  }

  async getRedeemTransactionsHistory(
    wallet: Wallet
  ): Promise<RedeemTransaction[]> {
    const repository = this.client.getRepository(RedeemTransaction);
    return await repository.find({
      where: { wallet },
    });
  }
}
