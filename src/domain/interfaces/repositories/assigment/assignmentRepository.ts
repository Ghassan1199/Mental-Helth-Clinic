import { EntityManager } from "typeorm";
import { Assignment } from "../../../entities/Assignment";

export interface IAssignmentRepository {
  createAssignment(userId: number, specId: number, entityManager?: EntityManager): Promise<void>;
  findAssignmentsBySpec(specId: number): Promise<Assignment[]>;
  findAssignmentByBoth(userId: number, specId: number): Promise<Assignment | null>;
  deleteAssignment(userId: number, specId: number, entityManager?: EntityManager): Promise<void>;

}
