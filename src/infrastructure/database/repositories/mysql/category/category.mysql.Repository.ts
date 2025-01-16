import { connectToDatabase } from "../../..";
import { DataSource, EntityManager } from "typeorm";
import { ICategoryRepository } from "../../../../../domain/interfaces/repositories/category/ICategoryRepository";
import { Category } from "../../../../../domain/entities/Category";
import { SpecialistCategory } from "../../../../../domain/entities/SpecialistCategory";
import { SpecialistProfile } from "../../../../../domain/entities/SpecialistProfile";

export class CategoryMysqlRepository implements ICategoryRepository {
  private client!: DataSource;

  constructor() {
    this.init();
  }
  async createSpecCategoryEntity(
    specialistProfileId: number,
    categoryId: number,
    entityManager?: EntityManager
  ): Promise<void> {
    if (entityManager) {
      await entityManager.save(SpecialistCategory, {
        specialistProfileId,
        categoryId,
      });
    } else {
      await this.client
        .getRepository(SpecialistCategory)
        .save({ specialistProfileId, categoryId });
    }
  }

  async createCategory(name: string, eng: string): Promise<void> {
    await this.client.getRepository(Category).save({ name, eng });
  }

  async getCategories(): Promise<Category[]> {
    return await this.client.getRepository(Category).find();
  }

  private async init() {
    this.client = await connectToDatabase();
  }
}
