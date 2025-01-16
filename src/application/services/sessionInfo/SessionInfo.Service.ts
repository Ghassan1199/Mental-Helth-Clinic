import { inject, injectable } from "tsyringe";
import { ICategoryRepository } from "../../../domain/interfaces/repositories/category/ICategoryRepository";
import { ISessionInfoRepository } from "../../../domain/interfaces/repositories/sessionInfo/ISessionInfo.Repository";
import StatusError from "../../utils/error";

import Validator from "../../validation/validator";
@injectable()
export class SessionInfoService {
  private validator: Validator;
  private sessionInfoRepository: ISessionInfoRepository;

  constructor(
    @inject(Validator)
    validator: Validator,
    @inject("ISessionInfoRepository")
    sessionInfoRepository: ISessionInfoRepository
  ) {
    this.validator = validator;
    this.sessionInfoRepository = sessionInfoRepository;
  }

  async addSessionInfo(time: string, price: number) {
    this.validator.validateRequiredFields({ time, price });

    await this.sessionInfoRepository.createSessionInfo(time, price);
  }

  async updateSessionInfo(sessionInfoId: number, time: string, price: number) {
    this.validator.validateRequiredFields({ sessionInfoId });
    const sessionInfo = await this.sessionInfoRepository.getOne(sessionInfoId);

    if (!sessionInfo) throw new StatusError(400, "Session info not found");

    if (time) sessionInfo.time = time;
    if (price) sessionInfo.price = price;

    await this.sessionInfoRepository.update(sessionInfo);
  }

  async getSessionInfo() {
    return await this.sessionInfoRepository.get();
  }
}
