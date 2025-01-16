import { inject, injectable } from "tsyringe";
import { Appointment } from "../../domain/entities/Appointment";
import { RedeemCode } from "../../domain/entities/RedeemCode";
import { RedeemTransaction } from "../../domain/entities/RedeemTransaction";
import { Transaction } from "../../domain/entities/Transaction";
import { Wallet } from "../../domain/entities/Wallet";
import { IRedeemTransactionRepository } from "../../domain/interfaces/repositories/IRedeemTransactionRepository";
import { ITransactionRepository } from "../../domain/interfaces/repositories/ITransactionRepository";
import { IWalletRepository } from "../../domain/interfaces/repositories/IWalletRepository";
import { ICodeRepository } from "../../domain/interfaces/repositories/code/ICodeRepository";
import { connectToDatabase } from "../../infrastructure/database";
import StatusError from "../utils/error";
import { EntityManager } from "typeorm";
@injectable()
export class TransactionService {
  private walletRepository!: IWalletRepository;
  private transactionRepository!: ITransactionRepository;
  private codeRepository!: ICodeRepository;
  private redeemTransactionRepository!: IRedeemTransactionRepository;

  constructor(
    @inject("IWalletRepository")
    walletRepository: IWalletRepository,
    @inject("ITransactionRepository")
    transactionRepository: ITransactionRepository,
    @inject("ICodeRepository")
    codeRepository: ICodeRepository,
    @inject("IRedeemTransactionRepository")
    redeemTransactionRepository: IRedeemTransactionRepository
  ) {
    this.walletRepository = walletRepository;
    this.transactionRepository = transactionRepository;
    this.codeRepository = codeRepository;
    this.redeemTransactionRepository = redeemTransactionRepository;
  }

  async create(
    specialistWallet: Wallet,
    userWallet: Wallet,
    appointment: Appointment,
    amount: number,
    entityManager?: EntityManager
  ): Promise<Transaction | any> {
    if (userWallet === specialistWallet) {
      throw new Error("Cannot transfer funds to the same wallet");
    }

    if (!userWallet || !specialistWallet) {
      throw new Error("One or both wallets not found");
    }

    if (userWallet.balance < amount) {
      throw new Error("Insufficient funds in source wallet");
    }
    userWallet.balance = userWallet.balance - amount;
    specialistWallet.balance = specialistWallet.balance + amount;

 
      // await (
      //   await connectToDatabase()
      // ).transaction(async (transactionalEntityManager) => {
      //   (await this.walletRepository.update(
      //     userWallet,
      //     transactionalEntityManager
      //   )) as any;
      //   await this.walletRepository.update(
      //     specialistWallet,
      //     transactionalEntityManager
      //   );
  
      //   return await this.transactionRepository.create(
      //     specialistWallet,
      //     userWallet,
      //     amount,
      //     appointment,
      //     transactionalEntityManager
      //   );
      // });

      (await this.walletRepository.update(
        userWallet,
        entityManager
      )) as any;
      await this.walletRepository.update(
        specialistWallet,
        entityManager
      );

      return await this.transactionRepository.create(
        specialistWallet,
        userWallet,
        amount,
        appointment,
        entityManager!
      );
      
 
  }

  async getTransactionHistory(wallet: Wallet): Promise<Transaction[]> {
    if (!wallet) {
      throw new Error("Wallet not found");
    }
    return await this.transactionRepository.getTransactionsHistory(wallet);
  }

  async getTransactionById(id: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new Error("transaction not found");
    }
    return transaction;
  }

  async createRedeemTransaction(
    redeemCode: RedeemCode,
    userWallet: Wallet
  ): Promise<any> {
    if (!userWallet || !redeemCode) {
      throw new Error("Wallet, code or both not found");
    }

    if(redeemCode.isUsed) throw new StatusError(400, "Code is invalid");
    userWallet.balance += redeemCode.amount;
    redeemCode.isUsed = true;

    let redeemTransaction: RedeemTransaction;
    await (
      await connectToDatabase()
    ).transaction(async (transactionalEntityManager) => {
      await this.walletRepository.update(
        userWallet,
        transactionalEntityManager
      );
      await this.codeRepository.update(redeemCode, transactionalEntityManager);

      redeemTransaction = await this.redeemTransactionRepository.create(
        redeemCode,
        userWallet,
        redeemCode.amount,
        transactionalEntityManager
      );
    });

    return userWallet.balance;
  }

  async getRedeemTransactionHistory(
    wallet: Wallet
  ): Promise<RedeemTransaction[]> {
    if (!wallet) {
      throw new Error("Wallet not found");
    }
    return await this.redeemTransactionRepository.getRedeemTransactionsHistory(
      wallet
    );
  }

  async getRedeemTransactionById(id: number): Promise<RedeemTransaction> {
    const transaction = await this.redeemTransactionRepository.findById(id);
    if (!transaction) {
      throw new Error("transaction not found");
    }
    return transaction;
  }
}
