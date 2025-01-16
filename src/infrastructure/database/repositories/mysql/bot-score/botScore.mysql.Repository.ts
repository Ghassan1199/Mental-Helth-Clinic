import { connectToDatabase } from "../../..";
import { DataSource, EntityManager } from "typeorm";
import { IBotScoreRepository } from "../../../../../domain/interfaces/repositories/bot-score/IBotScoreRepository";
import { BotScore } from "../../../../../domain/entities/BotScore";

export class BotScoreMysqlRepository implements IBotScoreRepository {
  private client!: DataSource;

  constructor() {
    this.init();
  }


  private async init() {
    this.client = await connectToDatabase();
  }

  async createScore(userId: number, score: string): Promise<void> {

    await this.client
    .getRepository(BotScore)
    .save({ userId, score });
}


async getScores(userId: number): Promise<BotScore[]> {
    return await this.client.getRepository(BotScore).find({where:{
        userId
    }});

}

}
