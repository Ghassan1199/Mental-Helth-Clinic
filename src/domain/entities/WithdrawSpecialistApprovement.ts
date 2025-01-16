import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,
} from "typeorm";
import { WithdrawSpecialistTransaction } from "./WithdrawSpecialistTransaction";

@Entity("withdrawSpecialistApprovement")
export class WithdrawSpecialistApprovement {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "description", type: "text" })
    description!: string;

    @Column({ name: "url", type: "text" })
    url!: string;

    @OneToOne(() => WithdrawSpecialistTransaction, (withdrawSpecialistTransaction) => withdrawSpecialistTransaction.withdrawSpecialistApprovement)
    withdrawSpecialistTransaction?: WithdrawSpecialistTransaction;

}
