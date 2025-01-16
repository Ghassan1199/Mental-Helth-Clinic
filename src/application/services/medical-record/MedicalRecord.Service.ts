import { inject, injectable } from "tsyringe";
import { User as Specialist } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { IMedicalRecordRepository } from "../../../domain/interfaces/repositories/medical-record/IMedicalRecordRepository";
import { connectToDatabase } from "../../../infrastructure/database";
import StatusError from "../../utils/error";
import dotenv from "dotenv";
import { IAppointmentRepository } from "../../../domain/interfaces/repositories/appointment/IAppointmentRepository";
dotenv.config();
@injectable()
export class MedicalRecordService {
  private medicalRecordRepository!: IMedicalRecordRepository;
  private userRepository!: IUserRepository;
  private appointmentRepository!: IAppointmentRepository;

  constructor(
    @inject("IMedicalRecordRepository")
    medicalRecordRepository: IMedicalRecordRepository,
    @inject("IUserRepository") userRepository: IUserRepository,
    @inject("IAppointmentRepository") appointmentRepository: IAppointmentRepository
  ) {
    this.medicalRecordRepository = medicalRecordRepository;
    this.userRepository = userRepository;
    this.appointmentRepository = appointmentRepository;
  }

  async getPatientMedicalRecords(userId: any) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new StatusError(404, "user not found");
    return this.medicalRecordRepository.getAllMedicalRecords(userId);
  }
  async createPatientMedicalRecord(
    doctor: Specialist,
    userId: number,
    input: any
  ) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new StatusError(404, "user not found");
    if (user.roleId != Number(process.env.USER_ROLE!))
      throw new StatusError(401, "unauthorized");

    if (doctor.roleId != Number(process.env.DOCTOR!))
      throw new StatusError(401, "unauthorized");

    
    const appo = await this.appointmentRepository.findComleteBySpecAndUser(doctor, user);
    if(appo == null) throw new StatusError(404, "you have to complete a session before creating a medical record.");
  

    const { mainComplaint } = input; //for medical Record
    const { symptoms, causes, startDate } = input; //for medical condition
    const { fType, fDescription } = input; // for medical family history
    const { pType, pDescription } = input; // for medical personal history
    const { differentialDiagnosis, treatmentPlan } = input; // for medical diagnosis

    await (
      await connectToDatabase()
    ).transaction(async (transactionalEntityManager) => {
      const mr = await this.addMedicalRecord(
        userId,
        doctor.id,
        mainComplaint,
        transactionalEntityManager
      );
      await this.addMedicalCondition(
        mr.id,
        symptoms,
        causes,
        startDate,
        transactionalEntityManager
      );

      await this.addMedicalFamilyHistory(
        mr.id,
        fType,
        fDescription,
        transactionalEntityManager
      );

      await this.addMedicalPersonalHistory(
        mr.id,
        pType,
        pDescription,
        transactionalEntityManager
      );

      await this.addMedicalDiagnosis(
        mr.id,
        differentialDiagnosis,
        treatmentPlan,
        transactionalEntityManager
      );
    });
  }

  async updatePatientMedicalRecord(doctorId: number, MRId: number, input: any) {
    const { mainComplaint } = input; //for medical Record
    const { symptoms, causes, startDate } = input; //for medical condition
    const { fType, fDescription } = input; // for medical family history
    const { pType, pDescription } = input; // for medical personal history
    const { differentialDiagnosis, treatmentPlan } = input; // for medical diagnosis

    const mr = await this.medicalRecordRepository.getMR(MRId);
    if (!mr) throw new StatusError(404, "Medical record not found");
    if (doctorId != mr.doctorId) throw new StatusError(401, "unauthorized");

    const mc = this.medicalRecordRepository.getMC(mr.id);
    const mfh = this.medicalRecordRepository.getMFH(mr.id);
    const mph = this.medicalRecordRepository.getMPH(mr.id);
    const md = this.medicalRecordRepository.getMD(mr.id);

    if (mainComplaint) mr.MainComplaint = mainComplaint;

    if (!(await mc)) {
      await this.addMedicalCondition(mr.id, symptoms, causes, startDate);
    } else {
      if (symptoms) (await mc)!.symptoms = symptoms;
      if (causes) (await mc)!.causes = causes;
      if (startDate) (await mc)!.startDate = startDate;
    }

    if (!(await mfh)) {
      await this.addMedicalFamilyHistory(mr.id, fType, fDescription);
    } else {
      if (fType) (await mfh)!.type = fType;
      if (fDescription) (await mfh)!.description = fDescription;
    }

    if (!(await mph)) {
      await this.addMedicalPersonalHistory(mr.id, pType, pDescription);
    } else {
      if (pType) (await mph)!.type = pType;
      if (pDescription) (await mph)!.description = pDescription;
    }

    if (!(await md)) {
      await this.addMedicalDiagnosis(
        mr.id,
        differentialDiagnosis,
        treatmentPlan
      );
    } else {
      if (differentialDiagnosis)
        (await md)!.differentialDiagnosis = differentialDiagnosis;
      if (treatmentPlan) (await md)!.treatmentPlan = treatmentPlan;
    }

    await (
      await connectToDatabase()
    ).transaction(async (transactionalEntityManager) => {
      await this.medicalRecordRepository.updateMR(
        mr,
        transactionalEntityManager
      );
      if ((await mc) != null) {
        await this.medicalRecordRepository.updateMC(
          (await mc)!,
          transactionalEntityManager
        );
      }
      if ((await mfh) != null) {
        await this.medicalRecordRepository.updateMFH(
          (await mfh)!,
          transactionalEntityManager
        );
      }

      if ((await mph) != null) {
        await this.medicalRecordRepository.updateMPH(
          (await mph)!,
          transactionalEntityManager
        );
      }

      if ((await md) != null) {
        await this.medicalRecordRepository.updateMD(
          (await md)!,
          transactionalEntityManager
        );
      }
    });
  }

  async addMedicalRecord(
    userId: number,
    doctorId: number,
    mainComplaint: string,
    transactionalEntityManager: any
  ) {
    return await this.medicalRecordRepository.createMR(
      userId,
      doctorId,
      mainComplaint,
      transactionalEntityManager
    );
  }

  async addMedicalCondition(
    medicalRecordId: number,
    symptoms: string,
    causes: string,
    startDate: Date,
    transactionalEntityManager?: any
  ) {
    if (!symptoms && !causes && !startDate) return null;
    return await this.medicalRecordRepository.createMC(
      medicalRecordId,
      symptoms,
      causes,
      startDate,
      transactionalEntityManager
    );
  }

  async addMedicalFamilyHistory(
    medicalRecordId: number,
    type: string,
    description: string,
    transactionalEntityManager?: any
  ) {
    if (!type && !description) return null;

    return await this.medicalRecordRepository.createMFH(
      medicalRecordId,
      type,
      description,
      transactionalEntityManager
    );
  }

  async addMedicalPersonalHistory(
    medicalRecordId: number,
    type: string,
    description: string,
    transactionalEntityManager?: any
  ) {
    if (!type && !description) return null;

    return await this.medicalRecordRepository.createMPH(
      medicalRecordId,
      type,
      description,
      transactionalEntityManager
    );
  }

  async addMedicalDiagnosis(
    medicalRecordId: number,
    differentialDiagnosis: string,
    treatmentPlan: string,
    transactionalEntityManager?: any
  ) {
    if (!differentialDiagnosis && !treatmentPlan) return null;

    return await this.medicalRecordRepository.createMD(
      medicalRecordId,
      differentialDiagnosis,
      treatmentPlan,
      transactionalEntityManager
    );
  }

  async getOneRecord(recordId: number){
  

    const mr = await this.medicalRecordRepository.getOneFullMr(recordId);

    if(mr == null) throw new StatusError(404, "medical record not found.");

    return mr;
    
  }
}
