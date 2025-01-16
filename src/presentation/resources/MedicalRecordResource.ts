import { MedicalRecord } from "../../domain/entities/MedicalRecord";

class MedicalRecordResource {
  constructor() {}

  async init(model: any) {
    if (Array.isArray(model)) {
      let resources = [];
      for (let i = 0; i < model.length; i++) {
        resources.push(await this.initializeResource(model[i]));
      }
      return resources;
    } else {
      return await this.initializeResource(model);
    }
  }

  async initializeResource(medicalRecord: MedicalRecord) {
    return {
      id: medicalRecord.id,
      MainComplaint: medicalRecord.MainComplaint,
      doctorUsername: await medicalRecord.doctor.specialistProfile?.fullName,
      patientName: await medicalRecord.user.userProfile?.fullName,
      createdAt: await medicalRecord.createdAt,
    };
  }
}

export default MedicalRecordResource;
