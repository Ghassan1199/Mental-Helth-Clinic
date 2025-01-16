import { EntityManager } from "typeorm";
import { User } from "../../domain/entities/User";
import { Wallet } from "../../domain/entities/Wallet";
import { IWalletRepository } from "../../domain/interfaces/repositories/IWalletRepository";
import StatusError from "../utils/error";
import { inject, injectable } from "tsyringe";
@injectable()
export class WalletService {
  private walletRepository!: IWalletRepository;

  constructor(
    @inject("IWalletRepository")
    walletRepository: IWalletRepository
  ) {
    this.walletRepository = walletRepository;
  }

  async create(input: any, entityManager: EntityManager): Promise<Wallet> {
    const newWallet = await this.walletRepository.create(input, entityManager);
    return newWallet;
  }

  async getById(id: number): Promise<Wallet> {
    const newWallet = await this.walletRepository.findById(id);
    if (!newWallet) {
      throw new StatusError(404, "Wallet not found .");
    }
    return newWallet!;
  }

  async getByUser(user: User): Promise<Wallet> {
    const newWallet = await this.walletRepository.findByUser(user);
    if (!newWallet) {
      throw new StatusError(404, "Wallet not found .");
    }
    return newWallet!;
  }
}
