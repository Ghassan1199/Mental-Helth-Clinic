import { inject, injectable } from "tsyringe";
import { ICodeRepository } from "../../../domain/interfaces/repositories/code/ICodeRepository";
import Validator from "../../validation/validator";
@injectable()
export class CodeService {
  private validator: Validator;
  private codeRepository: ICodeRepository;

  constructor(
    @inject(Validator) validator: Validator,
    @inject("ICodeRepository") codeRepository: ICodeRepository
  ) {
    this.validator = validator;
    this.codeRepository = codeRepository;
  }
  async create(amount: number, numberOfCodes: number) {
    const codes = [];
    this.validator.validateRequiredFields({ amount, numberOfCodes });
    for (let index = 0; index < numberOfCodes; index++) {
      const code = this.generateRandomCode(8);

      codes.push(await this.codeRepository.create(code, amount));
    }

    return codes;
  }

  async showCodeDetails(code: string) {
    this.validator.validateRequiredFields({ code });
    return await this.codeRepository.getCode(code);
  }

  async getAllCodes() {
    return await this.codeRepository.getAll();
  }

  generateRandomCode(length: number) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }

    return code;
  }
}
