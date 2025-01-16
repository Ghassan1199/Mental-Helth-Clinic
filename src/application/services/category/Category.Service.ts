import { inject, injectable } from "tsyringe";
import { ICategoryRepository } from "../../../domain/interfaces/repositories/category/ICategoryRepository";

import Validator from "../../validation/validator";

@injectable()
export class CategoryService {
  private validator: Validator;
  private categoryRepository: ICategoryRepository;

  constructor(
    @inject(Validator) validator: Validator,
    @inject("ICategoryRepository") categoryRepository: ICategoryRepository
  ) {
    this.validator = validator;
    this.categoryRepository = categoryRepository;
  }

  async createCategory(name: string, eng: string) {
    this.validator.validateRequiredFields({ name, eng });

    await this.categoryRepository.createCategory(name, eng);
  }

  async bindCategoryToSpec(specialistProfileId: number, categoryId: number) {
    this.validator.validateRequiredFields({ specialistProfileId, categoryId });
    await this.categoryRepository.createSpecCategoryEntity(
      specialistProfileId,
      categoryId
    );
  }

  async getCategories() {
    return await this.categoryRepository.getCategories();
  }
}
