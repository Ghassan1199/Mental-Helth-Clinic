import { Wallet } from "../../../../domain/entities/Wallet";
import { IWalletRepository } from "../../../../domain/interfaces/repositories/IWalletRepository";
import { connectToDatabase } from "../../";
import { DataSource, EntityManager } from "typeorm";
import { User } from "../../../../domain/entities/User";

export class WalletMysqlRepository implements IWalletRepository {
  private client!: DataSource;

  constructor() {
    this.init();
  }

  private async init() {
    this.client = await connectToDatabase();
  }

  async create(user: User, entityManager?: EntityManager): Promise<Wallet> {
    if (entityManager)
      return await entityManager.save(Wallet, { user: user, balance: 0 });
    const repository = this.client.getRepository(Wallet);
    const record = repository.create({ user: user });
    const savedWallet = await repository.save(record);
    return savedWallet;
  }

  async findById(id: number): Promise<Wallet | null> {
    const repository = this.client.getRepository(Wallet);
    const wallet = await repository.findOneBy({ id: id });
    return wallet || null;
  }


    async findByUser(user: User): Promise<Wallet | null> {
        const repository = this.client.getRepository(Wallet);
        const wallet = await repository.findOne({where: {user: user}});
        return wallet || null;
    }


  async update(
    wallet: Wallet,
    entityManager?: EntityManager
  ): Promise<Wallet | null> {
    if(entityManager) return await entityManager.save(Wallet, wallet);
    const repository = this.client.getRepository(Wallet);
    return await repository.save(wallet);
  }
}
