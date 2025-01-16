import { Response, NextFunction } from "express";
import { successfulResponse } from "../../../application/utils/responseMessage";
import AuthenticatedRequest from "../../../domain/interfaces/utils/AuthenticatedRequest";
import { WithdrawService } from "../../../application/services/withdraw/Withdraw.Service";
import { inject, injectable } from "tsyringe";
@injectable()
export class WithdrawController {
  private withdrawService: WithdrawService;

  constructor(@inject(WithdrawService) withdrawService: WithdrawService) {
    this.withdrawService = withdrawService;
  }

  async creatWithdrawTransaction(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { requestId } = req.params;

      const { status, description } = req.body;

      const file = req.files![0];

      const admin = req.adminAuth!.admin;
      await this.withdrawService.createWithdrawTransaction(
        admin,
        Number(requestId),
        Boolean(status == "true"),
        description,
        file
      );

      res.status(200).json(successfulResponse("Request has been handled"));
    } catch (error: any) {
      next(error);
    }
  }

  async getAllWithdrawRequests(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const reqs = await this.withdrawService.getAllWithdrawRequests();

      res.status(200).json(successfulResponse("Requests", reqs));
    } catch (error: any) {
      next(error);
    }
  }

  async showWithdrawRequest(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { requestId } = req.params;

      const requests = await this.withdrawService.showWithdrawRequest(
        Number(requestId)
      );

      res.status(200).json(successfulResponse("Request", requests));
    } catch (error: any) {
      next(error);
    }
  }

  async getAllWithdrawTransactions(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.params;

      const trans = await this.withdrawService.getAllWithdrawTransactions(
        Number(userId)
      );

      res.status(200).json(successfulResponse("Transactions", trans));
    } catch (error: any) {
      next(error);
    }
  }

  async showWithdrawTransaction(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { transactionId } = req.params;

      const tran = await this.withdrawService.showWithdrawTransaction(
        Number(transactionId)
      );

      res.status(200).json(successfulResponse("Transaction", tran));
    } catch (error: any) {
      next(error);
    }
  }
}
