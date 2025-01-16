import { EntityManager } from "typeorm";
import { Transaction } from "../../entities/Transaction";
import { User } from "../../entities/User";
import { Wallet } from "../../entities/Wallet";
import { Appointment } from "../../entities/Appointment";

export interface ITransactionRepository {
    create(
        specialistWallet: Wallet,
        userWallet: Wallet,
        amount: number,
        appointment: Appointment,
        entityManager: EntityManager
    ): Promise<Transaction|null>;

    findById(id: number): Promise<Transaction | null>;
    getAll(): Promise<Transaction[] | null>;
    getTransactionsHistory(wallet: Wallet): Promise<Transaction[]>;
}
