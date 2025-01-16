import { connectToDatabase } from "../../..";
import { DataSource, EntityManager } from "typeorm";
import { IMedicalRecordRepository } from "../../../../../domain/interfaces/repositories/medical-record/IMedicalRecordRepository";
import { MedicalCondition } from "../../../../../domain/entities/MedicalCondition";
import { MedicalDiagnosis } from "../../../../../domain/entities/MedicalDiagnosis";
import { MedicalFamilyHistory } from "../../../../../domain/entities/MedicalFamilyHistory";
import { MedicalPersonalHistory } from "../../../../../domain/entities/MedicalPersonalHistory";
import { MedicalRecord } from "../../../../../domain/entities/MedicalRecord";
export class MedicalRecordMysqlRepository implements IMedicalRecordRepository {
  private client!: DataSource;

  constructor() {
    this.init();
  }

  async getAllMedicalRecords(
    userId?: number | undefined,
    doctorId?: number | undefined
  ): Promise<any> {
    const repository = this.client.getRepository(MedicalRecord);
    let where: any = {};
    if (userId) where.userId = userId;
    if (doctorId) where.doctorId = doctorId;

    const record = await repository.find({
      where,
      relations: [
        "medicalConditions",
        "medicalFamilyHistories",
        "medicalPersonalHistories",
        "medicalDiagnosis",
        "user",
        "doctor",
        "user.userProfile",
        "doctor.specialistProfile",
      ],
      order: {
        id: "DESC",
      },
    });

    return record!;
  }
  async updateMR(
    record: MedicalRecord,
    entityManager?: EntityManager | undefined
  ): Promise<MedicalRecord> {
    if (entityManager) return await entityManager.save(MedicalRecord, record);

    const repository = this.client.getRepository(MedicalRecord);
    return await repository.save(record);
  }
  async updateMC(
    record: MedicalCondition,
    entityManager?: EntityManager | undefined
  ): Promise<MedicalCondition> {
    if (entityManager)
      return await entityManager.save(MedicalCondition, record);

    const repository = this.client.getRepository(MedicalCondition);
    return await repository.save(record);
  }
  async updateMFH(
    record: MedicalFamilyHistory,
    entityManager?: EntityManager | undefined
  ): Promise<MedicalFamilyHistory> {
    if (entityManager)
      return await entityManager.save(MedicalFamilyHistory, record);

    const repository = this.client.getRepository(MedicalFamilyHistory);
    return await repository.save(record);
  }
  async updateMPH(
    record: MedicalPersonalHistory,
    entityManager?: EntityManager | undefined
  ): Promise<MedicalPersonalHistory> {
    if (entityManager)
      return await entityManager.save(MedicalPersonalHistory, record);

    const repository = this.client.getRepository(MedicalPersonalHistory);
    return await repository.save(record);
  }
  async updateMD(
    record: MedicalDiagnosis,
    entityManager?: EntityManager | undefined
  ): Promise<MedicalDiagnosis> {
    if (entityManager)
      return await entityManager.save(MedicalDiagnosis, record);

    const repository = this.client.getRepository(MedicalDiagnosis);
    return await repository.save(record);
  }

  async getMR(MRId: number): Promise<MedicalRecord | null> {
    const repository = this.client.getRepository(MedicalRecord);

    const record = await repository.findOne({
      where: {
        id: MRId,
      },
    });

    return record!;
  }
  async getMC(medicalRecordId: number): Promise<MedicalCondition | null> {
    const repository = this.client.getRepository(MedicalCondition);

    const record = await repository.findOne({
      where: {
        medicalRecordId,
      },
    });

    return record!;
  }
  async getMFH(medicalRecordId: number): Promise<MedicalFamilyHistory | null> {
    const repository = this.client.getRepository(MedicalFamilyHistory);

    const record = await repository.findOne({
      where: {
        medicalRecordId,
      },
    });

    return record!;
  }
  async getMPH(
    medicalRecordId: number
  ): Promise<MedicalPersonalHistory | null> {
    const repository = this.client.getRepository(MedicalPersonalHistory);

    const record = await repository.findOne({
      where: {
        medicalRecordId,
      },
    });

    return record!;
  }
  async getMD(medicalRecordId: number): Promise<MedicalDiagnosis | null> {
    const repository = this.client.getRepository(MedicalDiagnosis);

    const record = await repository.findOne({
      where: {
        medicalRecordId,
      },
    });

    return record!;
  }

  private async init() {
    this.client = await connectToDatabase();
  }

  async createMR(
    userId: number,
    doctorId: number,
    MainComplaint: string,
    entityManager?: EntityManager | undefined
  ): Promise<MedicalRecord> {
    if (entityManager) {
      const record = entityManager.create(MedicalRecord, {
        userId,
        doctorId,
        MainComplaint,
      });
      return await entityManager.save(record);
    }

    return await this.client
      .getRepository(MedicalRecord)
      .save({ userId, doctorId, MainComplaint });
  }
  async createMC(
    medicalRecordId: number,
    symptoms: string,
    causes: string,
    startDate: Date,
    entityManager?: EntityManager | undefined
  ): Promise<MedicalCondition> {
    if (entityManager) {
      const record = entityManager.create(MedicalCondition, {
        medicalRecordId,
        symptoms,
        causes,
        startDate,
      });
      return await entityManager.save(record);
    }

    const repo = this.client.getRepository(MedicalCondition);

    return await repo.save(
      repo.create({ medicalRecordId, symptoms, causes, startDate })
    );
  }
  async createMFH(
    medicalRecordId: number,
    type: string,
    description: string,
    entityManager?: EntityManager | undefined
  ): Promise<MedicalFamilyHistory> {
    if (entityManager) {
      const record = entityManager.create(MedicalFamilyHistory, {
        medicalRecordId,
        type,
        description,
      });
      return await entityManager.save(record);
    }

    const repo = this.client.getRepository(MedicalFamilyHistory);

    return await repo.save(repo.create({ medicalRecordId, type, description }));
  }
  async createMPH(
    medicalRecordId: number,
    type: string,
    description: string,
    entityManager?: EntityManager | undefined
  ): Promise<MedicalPersonalHistory> {
    if (entityManager) {
      const record = entityManager.create(MedicalPersonalHistory, {
        medicalRecordId,
        type,
        description,
      });
      return await entityManager.save(record);
    }

    const repo = this.client.getRepository(MedicalPersonalHistory);

    return await repo.save(repo.create({ medicalRecordId, type, description }));
  }
  async createMD(
    medicalRecordId: number,
    differentialDiagnosis: string,
    treatmentPlan: string,
    entityManager?: EntityManager | undefined
  ): Promise<MedicalDiagnosis> {
    if (entityManager) {
      const record = entityManager.create(MedicalDiagnosis, {
        medicalRecordId,
        differentialDiagnosis,
        treatmentPlan,
      });
      return await entityManager.save(record);
    }

    const repo = this.client.getRepository(MedicalDiagnosis);

    return await repo.save(
      repo.create({ medicalRecordId, differentialDiagnosis, treatmentPlan })
    );
  }

  async getOneFullMr(recordId: number): Promise<any> {
    const repository = this.client.getRepository(MedicalRecord);
   
    const record = await repository.findOne({
      where:{
        id: recordId
      },
      relations: [
        "medicalConditions",
        "medicalFamilyHistories",
        "medicalPersonalHistories",
        "medicalDiagnosis",
      ]
    });

    return record!;
  }
  async deleteMedicalRecord(medicalRecordId: number): Promise<void> {
    const repository = this.client.getRepository(MedicalRecord);
    const medicalRecord = await repository.findOne({
      where: { id: medicalRecordId },
      relations: [
        'medicalConditions',
        'medicalFamilyHistories',
        'medicalPersonalHistories',
        'medicalDiagnosis',
      ]
    });
  
    if (!medicalRecord) {
      throw new Error(`Medical record with id ${medicalRecordId} not found`);
    }
  
    await this.client.manager.transaction(async transactionalEntityManager => {
      if (medicalRecord.medicalConditions) {
        await transactionalEntityManager.remove(medicalRecord.medicalConditions);
      }
      if (medicalRecord.medicalFamilyHistories) {
        await transactionalEntityManager.remove(medicalRecord.medicalFamilyHistories);
      }
      if (medicalRecord.medicalPersonalHistories) {
        await transactionalEntityManager.remove(medicalRecord.medicalPersonalHistories);
      }
      if (medicalRecord.medicalDiagnosis) {
        await transactionalEntityManager.remove(medicalRecord.medicalDiagnosis);
      }
      await transactionalEntityManager.remove(medicalRecord);
    });
  }
}
