import { inject, injectable } from "tsyringe";
import { SpecialistProfile } from "../../../domain/entities/SpecialistProfile";
import { User as Specialist } from "../../../domain/entities/User";
import { ISpecialistProfileRepository } from "../../../domain/interfaces/repositories/specs/IProfile.Repository";
import { FileData } from "../../../domain/interfaces/utils/AuthenticatedRequest";
import StatusError from "../../utils/error";
import Validator from "../../validation/validator";
import { deleteFromCloudinary, uploadToCloudinary } from "../../../presentation/middlewares/handlers/cloudinary.handler";
@injectable()
export class SpecialistProfileService {
  profileRepository!: ISpecialistProfileRepository;
  private validator: Validator;

  constructor(
    @inject("ISpecialistProfileRepository")
    profileRepository: ISpecialistProfileRepository,
    @inject(Validator) validator: Validator,
  ) {
    this.profileRepository = profileRepository;
    this.validator = validator;
  }

  async getSpecProfile(userId: number): Promise<SpecialistProfile> {
    this.validator.validateRequiredFields({ userId });

    const profile = await this.profileRepository.getByUserId(userId);

    if (!profile) throw new StatusError(404, "Profile not found.");

    return profile;
  }

  async getSpecStatus(userId: number): Promise<SpecialistProfile> {
    this.validator.validateRequiredFields({ userId });

    const status = await this.profileRepository.getByUserId(userId, {
      status: true,
    });

    if (!status) throw new StatusError(404, "Profile not found.");

    return status;
  }

  async editProfile(
    userId: number,
    updatedData: SpecialistProfile,
    file: FileData
  ): Promise<void> {
    this.validator.validateUpdateProfile(updatedData, file);

    const { phone, dateOfBirth, fullName, gender, studyInfo, specInfo } =
      updatedData;

    const profile = await this.getSpecProfile(userId);

    if (phone) {
      this.validator.isValidPhoneNumber(String(phone))
        ? (profile.phone = phone)
        : (() => {
            throw new StatusError(400, "Invalid phone number.");
          })();
    }
    if (dateOfBirth) {
      this.validator.isValidDate(String(dateOfBirth))
        ? (profile.dateOfBirth = dateOfBirth)
        : (() => {
            throw new StatusError(400, "Invalid date.");
          })();
    }
    if (fullName) {
      this.validator.isValidUserName(fullName)
        ? (profile.fullName = fullName)
        : (() => {
            throw new StatusError(400, "Invalid name format.");
          })();
    }

    if (gender) {
      profile.gender = gender;
    }

    if (file) {
  
      const url = await uploadToCloudinary(file.data!, "image", "spec_photos");
      const public_id = profile.photo.match(/spec_photos\/(.*?)(?=\.[^.]*$)/)?.[0];
      await deleteFromCloudinary(public_id!);
      profile.photo = url;
    }

    if (specInfo) {
      profile.specInfo = specInfo;
    }

    if (studyInfo) {
      profile.studyInfo = studyInfo;
    }
    await this.profileRepository.update(profile);
  }
}
