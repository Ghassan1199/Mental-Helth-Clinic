import { inject, injectable } from "tsyringe";
import { ICategoryRepository } from "../../../domain/interfaces/repositories/category/ICategoryRepository";

import Validator from "../../validation/validator";
import { IBotScoreRepository } from "../../../domain/interfaces/repositories/bot-score/IBotScoreRepository";
import { UserService } from "../patient/Patient.auth.Service";
import StatusError from "../../utils/error";

@injectable()
export class BotScoreService {
  private validator: Validator;
  private botScoreRepository: IBotScoreRepository;
  private userService: UserService;

  constructor(
    @inject(Validator) validator: Validator,
    @inject("IBotScoreRepository") botScoreRepository: IBotScoreRepository,
    @inject(UserService) userService: UserService

  ) {
    this.validator = validator;
    this.botScoreRepository = botScoreRepository;
    this.userService = userService;

  }

  async createScore(userId: number, score: string) {
    this.validator.validateRequiredFields({ userId, score });
    const user = await this.userService.getUser(userId);

    if(!user) throw new StatusError(404, " user not found");
    await this.botScoreRepository.createScore(userId, score);
  }


  async getScores(userId: number) {
    return await this.botScoreRepository.getScores(userId);
  }
}
