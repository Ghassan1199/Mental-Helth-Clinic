import {
    Entity,
    PrimaryGeneratedColumn,
    Column,JoinColumn,
    OneToOne,
    ManyToOne,OneToMany
} from "typeorm";
import { Transaction } from "./Transaction";
import { User } from "./User";
import { RedeemTransaction } from "./RedeemTransaction";
import { WithdrawSpecialistTransaction } from "./WithdrawSpecialistTransaction";

@Entity("wallets")
export class Wallet {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "balance", type: "float" })
    balance!: number;

    @OneToMany(() => Transaction, (transaction) => transaction.userWallet, { cascade: true }) 
    transactions?: Transaction[];

    @OneToOne(() => User, (user) => user.wallet, {
        cascade: true,
    })
    @JoinColumn({ name: "userId", referencedColumnName: "id" })
    user!: User;

    @OneToMany(() => RedeemTransaction, (redeemTransaction) => redeemTransaction.wallet, { cascade: true }) 
    redeemTransactions!: RedeemTransaction[];

    @OneToMany(() => WithdrawSpecialistTransaction, (withdrawSpecialistTransaction) => withdrawSpecialistTransaction.wallet, { cascade: true }) 
    withdrawSpecialistTransactions!: WithdrawSpecialistTransaction[];


}
