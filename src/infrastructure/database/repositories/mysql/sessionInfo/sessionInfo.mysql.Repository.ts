import { connectToDatabase } from "../../..";
import { DataSource } from "typeorm";
import { ICityRepository } from "../../../../../domain/interfaces/repositories/city/ICityRepository";
import { City } from "../../../../../domain/entities/City";
import { ISessionInfoRepository } from "../../../../../domain/interfaces/repositories/sessionInfo/ISessionInfo.Repository";
import { SessionInfo } from "../../../../../domain/entities/SessionInfo";

export class SessionInfoMysqlRepository implements ISessionInfoRepository {
  private client!: DataSource;

  constructor() {
    this.init();
  }
  async createSessionInfo(time: string, price: number): Promise<void> {
    await this.client.getRepository(SessionInfo).save({ time, price });
  }
  async getOne(sessionInfoId: number): Promise<SessionInfo | null> {
    return await this.client.getRepository(SessionInfo).findOne({
      where: {
        id: sessionInfoId,
      },
    });
  }
  async get(): Promise<SessionInfo[]> {
    return await this.client.getRepository(SessionInfo).find();
  }

  async update(record: SessionInfo): Promise<void> {
    await this.client.getRepository(SessionInfo).save(record);
  }

  private async init() {
    this.client = await connectToDatabase();
  }
}
