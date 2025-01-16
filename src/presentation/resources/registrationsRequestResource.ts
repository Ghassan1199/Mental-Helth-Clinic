import { MedicalRecord } from "../../domain/entities/MedicalRecord";
import { RegistrationRequest } from "../../domain/entities/RegistrationRequest";
import { RegistrationRequestCategory } from "../../domain/entities/RegistrationRequestCategory";
import { RegistrationRequestContent } from "../../domain/entities/RegistrationRequestContent";

class RegistrationsRequestResource {
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



  async initCategories(registrationRequestCategories?: RegistrationRequestCategory[]) {
    if(!registrationRequestCategories) return null;
    if (Array.isArray(registrationRequestCategories)) {
      let resources = [];
      for (let i = 0; i < registrationRequestCategories.length; i++) {
        resources.push(await this.initializeCategory(registrationRequestCategories[i]));
      }
      return resources;
    } else {
      return await this.initializeCategory(registrationRequestCategories);
    }
  }

  async initializeCategory(registrationRequestCategory: RegistrationRequestCategory) {
    return {
        
        name: registrationRequestCategory.category.name
    };
  }


  async initFiles(registrationRequestContents?: RegistrationRequestContent[]) {
    if(!registrationRequestContents) return null;
    if (Array.isArray(registrationRequestContents)) {
      let resources = [];
      for (let i = 0; i < registrationRequestContents.length; i++) {
        resources.push(await this.initializeFile(registrationRequestContents[i]));
      }
      return resources;
    } else {
      return await this.initializeFile(registrationRequestContents);
    }
  }

  async initializeFile(registrationRequestContents: RegistrationRequestContent) {
    return {
        
        url: registrationRequestContents.url
    };
  }
  async initializeResource(request: RegistrationRequest) {

    const profile = { email: request.specialist.email, specId: request.specialist.id, ...request.specialist.specialistProfile}


    return {
        
        requestId: request.id,
        status: request.status,
        date: request.date,
        description: request.description,
        clinicName: request.clinicName,
        address: request.address,
        latitude: request.latitude,
        longitude: request.longitude,
        city: request.city?.name || null,
        roleId: request.roleId,
        categories: await this.initCategories(request.registrationRequestCategories),
        files: await this.initFiles(request.registrationRequestContents),
        profile


    };
  }
}

export default RegistrationsRequestResource;
