import { Response, NextFunction } from "express";
import AuthenticatedRequest from "../../../domain/interfaces/utils/AuthenticatedRequest";
import { successfulResponse } from "../../../application/utils/responseMessage";
import { inject, injectable } from "tsyringe";
import { BlockService } from "../../../application/services/block/Block.Service";
import { UserService } from "../../../application/services/patient/Patient.auth.Service";
import StatusError from "../../../application/utils/error";
import env from "dotenv";
import BlockResource from "../../resources/BlockResource";
env.config();
@injectable()
export class BlockController {
  private blockService: BlockService;
  private userService: UserService

  constructor(@inject(BlockService) blockService: BlockService, @inject(UserService) userService: UserService) {
    this.blockService = blockService;
    this.userService = userService;

  }

  async block(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, specId } = req.body;
      const doctor = req.auth!.user;


      if(specId && doctor.roleId == Number(process.env.USER_ROLE)){

        const spec = await this.userService.getUser(specId);
        if(!spec) throw new StatusError(404, "therapist not found.");
        const user = doctor;

        if(spec.roleId == Number(process.env.DOCTOR)) throw new StatusError(404, "You can not block a doctor!!.");

        await this.blockService.createBlock(spec, user.id, false);
      }else{
        await this.blockService.createBlock(doctor, userId, true);

      }

      res.status(201).json(successfulResponse("User has been blocked"));
    } catch (error: any) {
      next(error);
    }
  }

  async getBlocks(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

      const user = req.auth!.user;

      let blocks;
      if(user.roleId != Number(process.env.USER_ROLE)){
       blocks = this.blockService.getBlocks(user.id);
      }else{
        blocks = this.blockService.getBlocksByUser(user.id);
      }

      res.status(200).json(successfulResponse("blocked users", await new BlockResource().init(await blocks)));
    } catch (error: any) {
      next(error);
    }
  }


  async showBlock(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {


      const {userId} = req.params;
      const doctorId = req.auth!.user.id;

      const block = this.blockService.showBlock(doctorId, Number(userId));

      res.status(200).json(successfulResponse("blocked user", await block));
    } catch (error: any) {
      next(error);
    }
  }


  async unblock(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction    
  ) {
    try {


      const { userId, specId } = req.body;
      const doctor = req.auth!.user;


      if(specId && doctor.roleId == Number(process.env.USER_ROLE)){

        const user = doctor;

        await this.blockService.deleteBlock(specId, user.id, false);
      }else{
        await this.blockService.deleteBlock(doctor.id, userId, true);
      }


      res.status(200).json(successfulResponse("User has been unblocked"));
    } catch (error: any) {
      next(error);
    }
  }
}
