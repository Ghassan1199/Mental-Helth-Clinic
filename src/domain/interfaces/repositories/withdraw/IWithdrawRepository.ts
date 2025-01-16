import { EntityManager } from "typeorm";
import { Wallet } from "../../../entities/Wallet";
import { WithdrawSpecialistTransaction } from "../../../entities/WithdrawSpecialistTransaction";
import { WithdrawSpecialistApprovement } from "../../../entities/WithdrawSpecialistApprovement";
import { WithdrawSpecialistRequest } from "../../../entities/WithdrawSpecialistRequest";

export interface IWithdrawRepository {
    createWithdrawTransaction(wallet: Wallet, withdrawSpecialistRequest: WithdrawSpecialistRequest, amount: number, withdrawSpecialistApprovement: WithdrawSpecialistApprovement, entityManager: EntityManager): Promise<WithdrawSpecialistTransaction>;
    getWithdrawTransactions(where: {}): Promise<WithdrawSpecialistTransaction[]>;
    getWithdrawTransaction(where: {}): Promise<WithdrawSpecialistTransaction | null>;

    createWithdrawApprovment(url: string, description: string, entityManager: EntityManager): Promise<WithdrawSpecialistApprovement>;


    getAllWithdrawRequests(): Promise<WithdrawSpecialistRequest[]>;
    getWithdrawRequest(requestId: number): Promise<WithdrawSpecialistRequest | null>;
    updateWithdrawRequest(record: WithdrawSpecialistRequest, entityManager: EntityManager): Promise<WithdrawSpecialistRequest>;


}
