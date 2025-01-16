import { connectToDatabase } from "../../..";
import { DataSource, EntityManager } from "typeorm";
import { ICodeRepository } from "../../../../../domain/interfaces/repositories/code/ICodeRepository";
import { RedeemCode } from "../../../../../domain/entities/RedeemCode";

export class CodeMysqlRepository implements ICodeRepository {
  private client!: DataSource;

  constructor() {
    this.init();
  }

  private async init() {
    this.client = await connectToDatabase();
  }
  async create(
    code: string,
    amount: number,
    entityManager?: EntityManager
  ): Promise<RedeemCode> {
    if (entityManager) return entityManager.save(RedeemCode, { code, amount });
    return await this.client.getRepository(RedeemCode).save({ code, amount });
  }
  async getAll(): Promise<RedeemCode[]> {
    return await this.client.getRepository(RedeemCode).find();
  }
  async getCode(code: string): Promise<RedeemCode | null> {
    return await this.client.getRepository(RedeemCode).findOne({
      where: {
        code,
      },
    });
  }
  async update(
    record: RedeemCode,
    entityManager?: EntityManager | undefined
  ): Promise<RedeemCode | null> {
    if (entityManager) return entityManager.save(RedeemCode, record);
    return await this.client.getRepository(RedeemCode).save(record);
  }
}
