class AppointmentRequestResource {
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

  async initializeResource(request: any) {
    return {
      id: request.id,
      status: request.status,
      patientApprove: request.patientApprove,
      description: request.description,
      proposedDate: request.proposedDate,
      patientId: await request.user.id,
      patientName: await request.user.userProfile.fullName,
      specialistName: await request.specialist.specialistProfile.fullName,
    };
  }
}

export default AppointmentRequestResource;
