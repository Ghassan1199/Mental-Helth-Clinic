import { connectToDatabase } from "../../..";
import { DataSource, EntityManager } from "typeorm";
import { IWithdrawRepository } from "../../../../../domain/interfaces/repositories/withdraw/IWithdrawRepository";
import { Wallet } from "../../../../../domain/entities/Wallet";
import { WithdrawSpecialistApprovement } from "../../../../../domain/entities/WithdrawSpecialistApprovement";
import { WithdrawSpecialistRequest } from "../../../../../domain/entities/WithdrawSpecialistRequest";
import { WithdrawSpecialistTransaction } from "../../../../../domain/entities/WithdrawSpecialistTransaction";

export class WithdrawMysqlRepository implements IWithdrawRepository {
  private client!: DataSource;

  constructor() {
    this.init();
  }
  private async init() {
    this.client = await connectToDatabase();
  }

  async createWithdrawTransaction(
    wallet: Wallet,
    withdrawSpecialistRequest: WithdrawSpecialistRequest,
    amount: number,
    withdrawSpecialistApprovement: WithdrawSpecialistApprovement,
    entityManager: EntityManager
  ): Promise<WithdrawSpecialistTransaction> {
    return await entityManager.save(WithdrawSpecialistTransaction, {
      wallet,
      withdrawSpecialistRequest,
      amount,
      withdrawSpecialistApprovement,
      date: new Date(),
    });
  }
  async getWithdrawTransactions(where: {}): Promise<
    WithdrawSpecialistTransaction[]
  > {
    return await this.client.getRepository(WithdrawSpecialistTransaction).find({
      where,
      order: {
        id: "DESC",
      },
    });
  }
  async getWithdrawTransaction(where: {}): Promise<WithdrawSpecialistTransaction | null> {
    return await this.client
      .getRepository(WithdrawSpecialistTransaction)
      .findOne({
        where,
        relations: [
          "withdrawSpecialistApprovement",
          "withdrawSpecialistRequest",
        ],
      });
  }
  async createWithdrawApprovment(
    url: string,
    description: string,
    entityManager: EntityManager
  ): Promise<WithdrawSpecialistApprovement> {
    return await entityManager.save(WithdrawSpecialistApprovement, {
      url,
      description,
    });
  }

  // async getAllWithdrawRequests(): Promise<WithdrawSpecialistRequest[]> {
  //   return await this.client.getRepository(WithdrawSpecialistRequest).find({
  //     order: {
  //       id: "DESC",
  //     },
  //   });
  //}

  async getAllWithdrawRequests(): Promise<WithdrawSpecialistRequest[]> {
    return await this.client
    .getRepository(WithdrawSpecialistRequest)
    .createQueryBuilder("withdrawSpecialistRequests")
    .leftJoinAndSelect("withdrawSpecialistRequests.specialist", "specialist")
    .leftJoinAndSelect("specialist.specialistProfile", "profile")
    .leftJoinAndSelect("specialist.wallet", "wallet")
                .select([
      "withdrawSpecialistRequests.id",
      "withdrawSpecialistRequests.amount",
      "withdrawSpecialistRequests.status",
      "withdrawSpecialistRequests.date",
      "withdrawSpecialistRequests.balance",
      "specialist.id",
      "profile.fullName",
    ])
    .getMany();
  }
  async getWithdrawRequest(
    requestId: number
  ): Promise<WithdrawSpecialistRequest | null> {
    return await this.client
      .getRepository(WithdrawSpecialistRequest)
      .createQueryBuilder("withdrawSpecialistRequests")
      .leftJoinAndSelect("withdrawSpecialistRequests.specialist", "specialist")
      .leftJoinAndSelect("specialist.specialistProfile", "profile")
      .leftJoinAndSelect("specialist.wallet", "wallet")
      .where("withdrawSpecialistRequests.id = :requestId", { requestId })
      .select([
        "withdrawSpecialistRequests.id",
        "withdrawSpecialistRequests.amount",
        "withdrawSpecialistRequests.status",
        "withdrawSpecialistRequests.date",
        "specialist.id",
        "profile.fullName",
        "wallet.balance",
      ])
      .getOne();
  }
  async updateWithdrawRequest(
    record: WithdrawSpecialistRequest,
    entityManager: EntityManager
  ): Promise<WithdrawSpecialistRequest> {
    return await entityManager.save(WithdrawSpecialistRequest, record);
  }
}
