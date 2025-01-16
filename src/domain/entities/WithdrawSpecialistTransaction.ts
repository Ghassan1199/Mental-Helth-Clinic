import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,ManyToOne
} from "typeorm";
import { WithdrawSpecialistRequest } from "./WithdrawSpecialistRequest";
import { WithdrawSpecialistApprovement } from "./WithdrawSpecialistApprovement";
import { Wallet } from "./Wallet";

@Entity("withdrawSpecialistTransactions")
export class WithdrawSpecialistTransaction {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "amount"})
    amount!: number;

    @Column({ name: "date", type: "date" })
    date!: Date;

    @OneToOne(() => WithdrawSpecialistRequest, (withdrawSpecialistRequest) => withdrawSpecialistRequest.withdrawSpecialistTransaction, { cascade: true })
    @JoinColumn({ name: "withdrawSpecialistRequestId", referencedColumnName: "id" })
    withdrawSpecialistRequest!: WithdrawSpecialistRequest;

    @OneToOne(() => WithdrawSpecialistApprovement, (withdrawSpecialistApprovement) => withdrawSpecialistApprovement.withdrawSpecialistTransaction, { cascade: true })
    @JoinColumn({ name: "withdrawSpecialistApprovementId", referencedColumnName: "id" })
    withdrawSpecialistApprovement!: WithdrawSpecialistApprovement;


    @ManyToOne(() => Wallet, (wallet) => wallet.withdrawSpecialistTransactions)
    @JoinColumn({ name: "walletId", referencedColumnName: "id" }) // Specify foreign key
    wallet!: Wallet;


}
