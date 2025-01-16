

import { EntityManager } from "typeorm";

import { MedicalRecord } from "../../../entities/MedicalRecord";
import { MedicalCondition } from "../../../entities/MedicalCondition";
import { MedicalFamilyHistory } from "../../../entities/MedicalFamilyHistory";
import { MedicalPersonalHistory } from "../../../entities/MedicalPersonalHistory";
import { MedicalDiagnosis } from "../../../entities/MedicalDiagnosis";


export interface IMedicalRecordRepository {
  createMR(
    userId: number,
    doctorId: number,
    MainComplaint: string | null,
    entityManager?: EntityManager
  ): Promise<MedicalRecord>;
  createMC(
    medicalRecordId: number,
    symptoms: string | null,
    causes: string | null,
    startDate: Date | null,
    entityManager?: EntityManager
  ): Promise<MedicalCondition>;
  createMFH(
    medicalRecordId: number | null,
    type: string | null,
    description: string | null,
    entityManager?: EntityManager
  ): Promise<MedicalFamilyHistory>;
  createMPH(
    medicalRecordId: number | null,
    type: string | null,
    description: string | null,
    entityManager?: EntityManager
  ): Promise<MedicalPersonalHistory>;
  createMD(
    medicalRecordId: number | null,
    differentialDiagnosis: string | null,
    treatmentPlan: string | null,
    entityManager?: EntityManager
  ): Promise<MedicalDiagnosis>;

  updateMR(
    record: MedicalRecord,
    entityManager?: EntityManager
  ): Promise<MedicalRecord>;
  updateMC(
    record: MedicalCondition,
    entityManager?: EntityManager
  ): Promise<MedicalCondition>;
  updateMFH(
    record: MedicalFamilyHistory,
    entityManager?: EntityManager
  ): Promise<MedicalFamilyHistory>;
  updateMPH(
    record: MedicalPersonalHistory,
    entityManager?: EntityManager
  ): Promise<MedicalPersonalHistory>;
  updateMD(
    record: MedicalDiagnosis,
    entityManager?: EntityManager
  ): Promise<MedicalDiagnosis>;

  getMR(MRId: number): Promise<MedicalRecord | null>;
  getMC(medicalRecordId: number): Promise<MedicalCondition | null>;
  getMFH(medicalRecordId: number): Promise<MedicalFamilyHistory | null>;
  getMPH(medicalRecordId: number): Promise<MedicalPersonalHistory | null>;
  getMD(medicalRecordId: number): Promise<MedicalDiagnosis | null>;

  getAllMedicalRecords(userId?: number, doctorId?: number): Promise<any>;

  getOneFullMr(recordId: number): Promise<any>;

  deleteMedicalRecord(medicalRecordId: number): Promise<void>;

}
