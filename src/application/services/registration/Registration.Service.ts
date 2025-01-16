import StatusError from "../../utils/error";

import Validator from "../../validation/validator";
import { IsNull } from "typeorm";

import { IRegistrationRepository } from "../../../domain/interfaces/repositories/registration/IRegistration.repository";
import { Admin } from "../../../domain/entities/Admin";
import { connectToDatabase } from "../../../infrastructure/database";
import { ClinicService } from "../Clinic.Service";
import { ICertificateRepository } from "../../../domain/interfaces/repositories/certifications/ICertificatesRepository";
import { SpecialistProfileService } from "../specs/SpecialistProfile.Service";
import { CategoryService } from "../category/Category.Service";
import { inject, injectable } from "tsyringe";
require("dotenv").config();
@injectable()
export class RegistrationService {
  private validator: Validator;
  private registrationRepository: IRegistrationRepository;
  private clinicService: ClinicService;
  private certificateRepository: ICertificateRepository;
  private profileService: SpecialistProfileService;
  private categoryService: CategoryService;

  constructor(
    @inject(Validator) validator: Validator,
    @inject("IRegistrationRepository")
    registrationRepository: IRegistrationRepository,
    @inject(ClinicService) clinicService: ClinicService,
    @inject("ICertificateRepository")
    certificateRepository: ICertificateRepository,
    @inject(SpecialistProfileService) profileService: SpecialistProfileService,
    @inject(CategoryService) categoryService: CategoryService
  ) {
    this.validator = validator;
    this.registrationRepository = registrationRepository;
    this.clinicService = clinicService;
    this.certificateRepository = certificateRepository;
    this.profileService = profileService;
    this.categoryService = categoryService;
  }

  async handleApprovalDecision(
    admin: Admin,
    requestId: number,
    status: boolean,
    description: string
  ) {
    const registrationRequest = await this.getById(requestId);
    if (!registrationRequest) throw new StatusError(404, "Request not found.");
    const profile = this.profileService.getSpecProfile(
      registrationRequest.specialistId
    );
    if (registrationRequest.status != null)
      throw new StatusError(400, "This request is already handled");

    registrationRequest.status = status;                    
    registrationRequest.description = description;
    registrationRequest.admin = admin;

    await (
      await connectToDatabase()
    ).transaction(async (transactionalEntityManager) => {
      (await profile).status = "unverified";
      await this.registrationRepository.updateRegistrationRequest(
        registrationRequest,
        transactionalEntityManager
      );
      if (status) {
        (await profile).status = "verified";
        if (registrationRequest.roleId == Number(process.env.DOCTOR)) {
          await this.clinicService.create(
            registrationRequest.clinicName,
            registrationRequest.specialistId,
            registrationRequest.cityId,
            registrationRequest.longitude,
            registrationRequest.latitude,
            registrationRequest.address,
            transactionalEntityManager
          );
        }

        for (const content of registrationRequest.registrationRequestContents!) {
          await this.certificateRepository.createCertificate(
            (
              await profile
            ).id,
            content.url
          );
        }

        for (const category of registrationRequest.registrationRequestCategories!) {
          await this.categoryService.bindCategoryToSpec(
            (
              await profile
            ).id,
            category.categoryId
          );
        }
      }
      await this.profileService.profileRepository.update(
        await profile,
        transactionalEntityManager
      );
    });
  }

  async getById(requestId: number) {
    this.validator.validateRequiredFields({ requestId });
    const registrationRequest = await this.registrationRepository.getOne({
      id: requestId,
    });

    if (!registrationRequest) throw new StatusError(404, "not found");

    return registrationRequest;
  }

  async getAll(status: string) {
    let query: any = {};
    if (!(status == "undefined")) {
      query.status = status === "null" ? IsNull() : Boolean(status == "true");
    }

    return await this.registrationRepository.getAll(query, {
      id: true,
      status: true,
    });
  }


  async getAllRR() {
  
    return await this.registrationRepository.getAllForAdmin();
  }
}
