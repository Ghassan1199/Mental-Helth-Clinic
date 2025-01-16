import { Response, NextFunction } from "express";
import AuthenticatedRequest from "../../../domain/interfaces/utils/AuthenticatedRequest";
import { successfulResponse } from "../../../application/utils/responseMessage";
import { CategoryService } from "../../../application/services/category/Category.Service";
import { inject, injectable } from "tsyringe";
import { BotScoreService } from "../../../application/services/bot-score/BotScore.Service";
@injectable()
export class BotScoreController {
  private botScoreService: BotScoreService;

  constructor(@inject(BotScoreService) botScoreService: BotScoreService) {
    this.botScoreService = botScoreService;
  }

  async addScore(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { score } = req.body;

      const userId = req.auth!.user.id;
      await this.botScoreService.createScore(userId, score);

      res.status(201).json(successfulResponse("Score is added"));
    } catch (error: any) {
      next(error);
    }
  }

  async getScores(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

      let { userId } = req.params;
      let id = parseInt(userId)

      const scores = this.botScoreService.getScores(id);

      res.status(200).json(successfulResponse("scores", await scores));
    } catch (error: any) {
      next(error);
    }
  }
}
