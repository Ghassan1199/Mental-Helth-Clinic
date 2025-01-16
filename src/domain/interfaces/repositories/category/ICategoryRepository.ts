import { EntityManager } from "typeorm";
import { Category } from "../../../entities/Category";
import { SpecialistProfile } from "../../../entities/SpecialistProfile";



export interface ICategoryRepository {
    createCategory(ar: string, eng: string): Promise<void>;
    createSpecCategoryEntity(specialistProfileId: number, categoryId: number, entityManager?:EntityManager): Promise<void>;
    getCategories(): Promise<Category[]>;
}
