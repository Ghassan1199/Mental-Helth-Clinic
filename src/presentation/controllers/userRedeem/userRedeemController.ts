import { Response, Request, NextFunction } from "express";

import { inject, injectable } from "tsyringe";
import { WalletService } from "../../../application/services/Wallet.Service";
import { TransactionService } from "../../../application/services/Transaction.Service";
import AuthenticatedRequest from "../../../domain/interfaces/utils/AuthenticatedRequest";
import { CodeService } from "../../../application/services/codes/Code.Service";
import StatusError from "../../../application/utils/error";
import { successfulResponse } from "../../../application/utils/responseMessage";
@injectable()
export class RedeemController {
    private redeemService: TransactionService;
  private codeService: CodeService;
  private walletService: WalletService;

  constructor(@inject(CodeService) codeService: CodeService,
   @inject(WalletService) walletService: WalletService,
@inject(TransactionService) redeemService: TransactionService) {
    this.codeService = codeService;
    this.walletService = walletService;
    this.redeemService = redeemService;
  }

  async redeemTransaction(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const {code} = req.body;
        const user = req.auth!.user
        const userWallet = await this.walletService.getByUser(user);
        const redeemCode = await this.codeService.showCodeDetails(code);
        if(redeemCode == null) throw new StatusError(404, "Code not found.");
    const balance = await this.redeemService.createRedeemTransaction(redeemCode, userWallet);
      return res.status(201).json(successfulResponse("Balance", balance));
    } catch (error: any) {

        next(error);
    }
  }

  
}
