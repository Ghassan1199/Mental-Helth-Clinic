import { Response, NextFunction } from "express";
import { successfulResponse } from "../../../application/utils/responseMessage";
import AuthenticatedRequest from "../../../domain/interfaces/utils/AuthenticatedRequest";
import { SpecialistProfileService } from "../../../application/services/specs/SpecialistProfile.Service";
import { inject, injectable } from "tsyringe";
@injectable()
export class SpecialistProfileController {
  private specialistProfileService: SpecialistProfileService;

  constructor(
    @inject(SpecialistProfileService)
    specialistProfileService: SpecialistProfileService
  ) {
    this.specialistProfileService = specialistProfileService;
  }

  async getSpecProfile(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.auth!.user.id;
      
      const profile = await this.specialistProfileService.getSpecProfile(
        userId
      );

      res.status(200).json(successfulResponse("Profile", profile));
    } catch (error: any) {
      next(error);
    }
  }


  async getRoleId(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
    

      res.status(200).json(successfulResponse("RoleId", {roleId:req.auth!.user.roleId}));
    } catch (error: any) {
      next(error);
    }
  }


  async getSpecStatus(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.auth!.user.id;

      const status = await this.specialistProfileService.getSpecStatus(userId);
      res.status(200).json(successfulResponse("Status", status));
    } catch (error: any) {
      next(error);
    }
  }

  async editProfile(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.auth!.user.id;

      const file = req.files![0];

      await this.specialistProfileService.editProfile(userId, req.body, file);

      res.status(200).json(successfulResponse("profiile edited"));
    } catch (error: any) {
      next(error);
    }
  }


  async getProfileForTherapistAndSpec(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {specId} = req.params;

      const profile = await this.specialistProfileService.getSpecProfile(
        Number(specId)
      );
      res.status(200).json(successfulResponse("Profile", profile));
    } catch (error: any) {
      next(error);
    }
  }
}
