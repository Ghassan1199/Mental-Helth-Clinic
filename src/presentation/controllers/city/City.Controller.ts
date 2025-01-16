import { Response, NextFunction } from "express";
import AuthenticatedRequest from "../../../domain/interfaces/utils/AuthenticatedRequest";
import { successfulResponse } from "../../../application/utils/responseMessage";
import { CityService } from "../../../application/services/city/City.Service";
import { inject, injectable } from "tsyringe";
@injectable()
export class CityController {
  private cityService: CityService;

  constructor(@inject(CityService) cityService: CityService) {
    this.cityService = cityService;
  }

  async addCity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { name, eng } = req.body;

      await this.cityService.createCity(name, eng);
                
      res.status(201).json(successfulResponse("City is added"));
    } catch (error: any) {
      next(error);
    }
  }

  async getCities(
    _req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cities = this.cityService.getCities();

      res.status(200).json(successfulResponse("Cities", await cities));
    } catch (error: any) {
      next(error);
    }
  }
}
