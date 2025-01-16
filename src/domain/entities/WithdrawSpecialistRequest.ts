import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,ManyToOne
} from "typeorm";
import { Admin } from "./Admin";
import { WithdrawSpecialistTransaction } from "./WithdrawSpecialistTransaction";
import { User } from "./User";

@Entity("withdrawSpecialistRequests")
export class WithdrawSpecialistRequest {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "amount" })
    amount!: number;

    @Column({ name: "status", nullable: true,  default: null })
    status!: boolean;

    @Column({ name: "date", type: "date" })
    date!: Date;

    @Column({ name: "balance", type: "float" })
    balance!: number;       

    @Column({ name: "specialistId", type: "date" })
    specialistId!: number;

    

    @ManyToOne(
        () => User,
        (user) => user.withdrawSpecialistRequests
    )
    @JoinColumn({ name: "specialistId", referencedColumnName: "id" }) // Specify foreign key
    specialist!: User;


    @ManyToOne(
        () => Admin,
        (admin) => admin.withdrawSpecialistRequests
    )
    @JoinColumn({ name: "adminId", referencedColumnName: "id" }) // Specify foreign key
    admin!: Admin;

    @OneToOne(() => WithdrawSpecialistTransaction, (withdrawSpecialistTransaction) => withdrawSpecialistTransaction.withdrawSpecialistRequest)
    withdrawSpecialistTransaction?: WithdrawSpecialistTransaction;




}
