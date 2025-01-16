import { stat } from "fs";
import { Admin } from "../../../domain/entities/Admin";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { IWalletRepository } from "../../../domain/interfaces/repositories/IWalletRepository";
import { IWithdrawRepository } from "../../../domain/interfaces/repositories/withdraw/IWithdrawRepository";
import { FileData } from "../../../domain/interfaces/utils/AuthenticatedRequest";
import { connectToDatabase } from "../../../infrastructure/database";
import StatusError from "../../utils/error";
import Validator from "../../validation/validator";
import { inject, injectable } from "tsyringe";
import { uploadToCloudinary } from "../../../presentation/middlewares/handlers/cloudinary.handler";
@injectable()
export class WithdrawService {
  private validator: Validator;
  private withdrawRepository: IWithdrawRepository;
  private walletRepository: IWalletRepository;
  private userRepository: IUserRepository;

  constructor(
    @inject(Validator) validator: Validator,
    @inject("IWithdrawRepository") withdrawRepository: IWithdrawRepository,
    @inject("IWalletRepository") walletRepository: IWalletRepository,
    @inject("IUserRepository") userRepository: IUserRepository,
  ) {
    this.validator = validator;
    this.withdrawRepository = withdrawRepository;
    this.walletRepository = walletRepository;
    this.userRepository = userRepository;
  }

  async createWithdrawTransaction(
    admin: Admin,
    requestId: number,
    status: boolean,
    description: string,
    file: FileData
  ) {
    this.validator.validateRequiredFields({ description });
    const request = await this.showWithdrawRequest(requestId);

    if (!request) throw new StatusError(404, "Request not found.");
    if (request.status != null)
      throw new StatusError(400, "Request is already handled.");

    let wallet = await this.walletRepository.findByUser(request.specialist);
    if (!wallet) throw new StatusError(404, "Wallet not found");



    request.status = status;
    request.admin = admin;
    wallet.balance -= request.amount;

    let url: string;
    if (status) {
       url = await uploadToCloudinary(file.data!, "image", "transaction_approvments");
    }

    await (
      await connectToDatabase()
    ).transaction(async (transactionalEntityManager) => {
      const updatedReq = await this.withdrawRepository.updateWithdrawRequest(
        request,
        transactionalEntityManager
      );

      if (status == true) {
        const approvment =
          await this.withdrawRepository.createWithdrawApprovment(
            url,
            description,
            transactionalEntityManager
          );

        await this.withdrawRepository.createWithdrawTransaction(
          wallet,
          updatedReq,
          updatedReq.amount,
          approvment,
          transactionalEntityManager
        );

        await this.walletRepository.update(wallet, transactionalEntityManager);
      }
    });
   
  }
  async getAllWithdrawTransactions(userId: number) {
    this.validator.validateRequiredFields({ userId });
    const user = await this.userRepository.findById(userId);
    if (!user) throw new StatusError(404, "User not found");
    const wallet = await this.walletRepository.findByUser(user!);
    return await this.withdrawRepository.getWithdrawTransactions({ wallet });
  }

  async showWithdrawTransaction(id: number) {
    this.validator.validateRequiredFields({ id });
    const trans = await this.withdrawRepository.getWithdrawTransaction({ id });
    if (!trans) throw new StatusError(404, "Transaction not found");
    return trans;
  }

  async getAllWithdrawRequests() {
    return await this.withdrawRepository.getAllWithdrawRequests();
  }

  async showWithdrawRequest(id: number) {
    this.validator.validateRequiredFields({ id });
    const req = await this.withdrawRepository.getWithdrawRequest(id);
    if (!req) throw new StatusError(404, "Request not found");
    return req;
  }
}
