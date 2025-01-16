import { connectToDatabase } from "../../..";
import { DataSource, EntityManager } from "typeorm";
import { IBlockingRepository } from "../../../../../domain/interfaces/repositories/blockings/IblockingRepository";
import { Blocking } from "../../../../../domain/entities/Blocking";

export class BlockMysqlRepository implements IBlockingRepository {
  private client!: DataSource;

  constructor() {
    this.init();
  }
  async showBlockBy(doctorId: number, userId: number, blockedBy: boolean): Promise<Blocking | null> {
    return await this.client.getRepository(Blocking).findOne({
      where: {
        doctorId,
        userId,
        blockedBy
      },
    });  }

  private async init() {
    this.client = await connectToDatabase();
  }
  async createBlock(
    doctorId: number,
    userId: number,
    blockedBy: boolean,
    entityManager?: EntityManager
  ): Promise<void> {
    if (entityManager) {
      const record = entityManager.create(Blocking, { userId, doctorId, blockedBy });
      entityManager.save(record);
      return;
    }
    await this.client.getRepository(Blocking).save({ userId, doctorId });
  }

  async getBlocks(doctorId: number): Promise<Blocking[]> {
    return await this.client.getRepository(Blocking).find({
      where: { doctorId, blockedBy:true },
      relations:["doctor", "doctor.specialistProfile", "user", "user.userProfile"]

    });       
  }

  async getBlocksByUser(userId: number): Promise<Blocking[]> {
    return await this.client.getRepository(Blocking).find({
      where: { userId, blockedBy: false },
      relations:["doctor", "doctor.specialistProfile", "user", "user.userProfile"]
    });
  }
  async showBlock(doctorId: number, userId: number): Promise<Blocking | null> {
    return await this.client.getRepository(Blocking).findOne({
      where: {
        doctorId,
        userId,
      },
    });
  }
  async deleteBlock(
    record: Blocking,
    entityManager?: EntityManager
  ): Promise<void> {
        if (entityManager) {
          entityManager.delete(Blocking, record);
          return;
        }

    await this.client.getRepository(Blocking).delete(record);
  }
}
