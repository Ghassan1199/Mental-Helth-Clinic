import { EntityManager } from "typeorm";
import { User } from "../../entities/User";
import { Wallet } from "../../entities/Wallet";

export interface IWalletRepository {
    create(input: any, entityManager?: EntityManager): Promise<Wallet>;
    findById(id: number): Promise<Wallet | null>;
    findByUser(user: User): Promise<Wallet | null>;
    update(wallet: Wallet, entityManager?:EntityManager): Promise<Wallet | null>;

}
