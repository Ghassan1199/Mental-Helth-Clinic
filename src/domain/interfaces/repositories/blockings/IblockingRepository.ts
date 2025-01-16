import { EntityManager } from "typeorm";
import { Blocking } from "../../../entities/Blocking";


export interface IBlockingRepository {
  createBlock(
    doctorId: number,
    userId: number,
    blockedBy: boolean,
    entityManager?: EntityManager
  ): Promise<void>;
  getBlocks(doctorId: number): Promise<Blocking[]>;
  getBlocksByUser(userId: number): Promise<Blocking[]>;
  showBlock(doctorId: number, userId: number): Promise<Blocking | null>;
  showBlockBy(doctorId: number, userId: number, blockedBy: boolean): Promise<Blocking | null>;

  deleteBlock(record: Blocking, entityManager?: EntityManager): Promise<void>;
}
