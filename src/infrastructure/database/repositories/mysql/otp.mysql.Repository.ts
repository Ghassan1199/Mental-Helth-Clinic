import { Otp } from "../../../../domain/entities/Otp";
import { connectToDatabase } from "../../";
import { IOtpRepository } from "../../../../domain/interfaces/repositories/IOtpRepository";
import { DataSource, EntityManager, LessThan, MoreThan, Repository } from "typeorm";

export class OtpMysqlRepository implements IOtpRepository {
  private client!: DataSource;

  constructor() {
    this.init();
  }

  private async init() {
    this.client = await connectToDatabase();
  }

  async create(input: any): Promise<Otp> {
    const { token, userId, expiredAt } = input;
    const repository = this.client.getRepository(Otp);
    const record = repository.create({
      token: token,
      userId: userId,
      expiredAt: expiredAt,
    });

    return await repository.save(record);
  }

  async getOtpByToken(token: number): Promise<Otp | null> {
    const repository = this.client.getRepository(Otp);
    const record = await repository.findOne({
      where: {
        token: token,
      },
    });
    return record;
  }

    async update(record: Otp, entityManager?: EntityManager) {
    if (!entityManager) {
      entityManager = this.client.manager;
    }   
    return await entityManager!.save(Otp, record);
  }

  async remove(record: Otp): Promise<void> {
    const repository = this.client.getRepository(Otp);
    await repository.delete(record);
  }

  async getOtps(where: any = {}): Promise<Otp[]> {
    const repository = this.client.getRepository(Otp);

    return await repository.find({ where });
  }
}
