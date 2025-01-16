import { Response, NextFunction } from "express";
import AuthenticatedRequest from "../../domain/interfaces/utils/AuthenticatedRequest";
import { inject, injectable } from "tsyringe";
import { IBlockingRepository } from "../../domain/interfaces/repositories/blockings/IblockingRepository";
import StatusError from "../utils/error";
@injectable()
class BlockedValidator {
  private blockRepository: IBlockingRepository;

  constructor(
    @inject("IBlockingRepository") blockRepository: IBlockingRepository
  ) {
    this.blockRepository = blockRepository;
    this.isBlocked = this.isBlocked.bind(this);
  }

  async isBlocked(specId: number, patientId: number) {
    const block = await this.blockRepository.showBlock(specId, patientId);
    if (block) {
      return true;
    }
    return false;
  }
  async checkBlock(specialistId: number, patientId: number): Promise<void> {
    const block = await this.isBlocked(specialistId, patientId);
    if (block) {
      throw new StatusError(
        400,
        "user you are trying to reach is unavilable right now."
      );
    }
  }
}

export default BlockedValidator;
