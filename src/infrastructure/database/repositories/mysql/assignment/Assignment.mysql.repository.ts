import { connectToDatabase } from "../../..";
import { DataSource, EntityManager } from "typeorm";
import { ICategoryRepository } from "../../../../../domain/interfaces/repositories/category/ICategoryRepository";
import { Category } from "../../../../../domain/entities/Category";
import { SpecialistCategory } from "../../../../../domain/entities/SpecialistCategory";
import { SpecialistProfile } from "../../../../../domain/entities/SpecialistProfile";
import { IAssignmentRepository } from "../../../../../domain/interfaces/repositories/assigment/assignmentRepository";
import { Assignment } from "../../../../../domain/entities/Assignment";

export class AssignmentMysqlRepository implements IAssignmentRepository {
  private client!: DataSource;

  constructor() {
    this.init();
  }
  async createAssignment(userId: number, specId: number, entityManager?: EntityManager): Promise<void> {
   
    if(entityManager){
      entityManager.save(Assignment, {userId, specId});
    } else{
    await this.client.getRepository(Assignment).save({ userId, specId });
    }
  }

  async deleteAssignment(userId: number, specId: number, entityManager?: EntityManager): Promise<void> {
   
    if(entityManager){
      entityManager.delete(Assignment, {userId, specId});
    } else{
    await this.client.getRepository(Assignment).delete({ userId, specId });
    }
  }

  async findAssignmentsBySpec(specId: number): Promise<Assignment[]> {
    return await this.client.getRepository(Assignment).find({
      where: {
        specId,
      },
      relations: ["user", "user.userProfile"],
    });
  }

  async findAssignmentByBoth(userId: number, specId: number): Promise<Assignment | null> {
    return await this.client.getRepository(Assignment).findOne({
      where: {
        specId,
        userId
      },
    });
  }

  private async init() {
    this.client = await connectToDatabase();
  }
}
