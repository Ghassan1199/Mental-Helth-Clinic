import { Wallet } from "../../../../domain/entities/Wallet";
import { connectToDatabase } from "../../";
import { DataSource, EntityManager } from "typeorm";
import { ITransactionRepository } from "../../../../domain/interfaces/repositories/ITransactionRepository";
import { Transaction } from "../../../../domain/entities/Transaction";
import { Appointment } from "../../../../domain/entities/Appointment";

export class TransactionMysqlRepository implements ITransactionRepository {
    private client!: DataSource;

    constructor() {
        this.init();
    }

    private async init() {
        this.client = await connectToDatabase();
    }

    async create(
        specialistWallet: Wallet,
        userWallet: Wallet,
        amount: number,
        appointment: Appointment,
        entityManager: EntityManager
    ): Promise<Transaction> {
        if(entityManager) {
            return await entityManager.save(Transaction, {
                specialistWallet: specialistWallet,
                userWallet: userWallet,
                amount: amount,
                appointment: appointment,
                date: new Date()
            });
        }
        const repository = this.client.getRepository(Transaction);
        const record = repository.create({
            specialistWallet: specialistWallet,
            userWallet: userWallet,
            amount: amount,
            appointment: appointment,
            date: new Date()

        });
        const savedTransaction = await repository.save(record);
        return savedTransaction;
    }

    async findById(id: number): Promise<Transaction | null> {
        const repository = this.client.getRepository(Transaction);
        const transaction = await repository.findOneBy({ id: id });
        return transaction || null;
    }

    async getAll(): Promise<Transaction[] | null> {
        const repository = this.client.getRepository(Transaction);
        const transactions = await repository.find();
        return transactions || null;
    }

    async getTransactionsHistory(wallet: Wallet): Promise<Transaction[]> {
        const repository = this.client.getRepository(Transaction);
        if (wallet.user.roleId == 0) {
            return await repository.find({
                where: { userWallet: wallet },
            });
        } else {
            return await repository.find({
                where: { specialistWallet: wallet },
            });
        }
    }
}
