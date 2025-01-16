import { BotScore } from "../../../entities/BotScore";



export interface IBotScoreRepository {
    createScore(userId: number, score: string): Promise<void>;
    getScores(userId: number): Promise<BotScore[]>;
}
