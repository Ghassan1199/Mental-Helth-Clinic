import { inject, injectable } from "tsyringe";
import { ICityRepository } from "../../../domain/interfaces/repositories/city/ICityRepository";

import Validator from "../../validation/validator";
@injectable()
export class CityService {
  private validator: Validator;
  private cityRepository: ICityRepository;

  constructor(
    @inject(Validator) validator: Validator,
    @inject("ICityRepository") cityRepository: ICityRepository
  ) {
    this.validator = validator;
    this.cityRepository = cityRepository;
  }

  async createCity(name: string, eng: string) {
    this.validator.validateRequiredFields({ name, eng });

    await this.cityRepository.createCity(name, eng);
  }

  async getCities() {
    return await this.cityRepository.getCities();
  }
}
