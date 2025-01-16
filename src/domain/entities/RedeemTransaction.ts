import {
    Entity,
    PrimaryGeneratedColumn,
    Column,JoinColumn,
    OneToOne,
    ManyToOne,
} from "typeorm";
import { Wallet } from "./Wallet";
import { RedeemCode } from "./RedeemCode";

@Entity("redeemTransactions")
export class RedeemTransaction {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "amount", type: "float" })
    amount!: number;

    @Column({ name: "date", type: "date" })
    date!: Date;

    @ManyToOne(() => Wallet, (wallet) => wallet.redeemTransactions)
    @JoinColumn({ name: "walletId", referencedColumnName: "id" }) // Specify foreign key
    wallet!: Wallet;

    @OneToOne(() => RedeemCode, (redeemCode) => redeemCode.redeemTransaction, { cascade: true })
    @JoinColumn({ name: "redeemCodeId", referencedColumnName: "id" })
    redeemCode!: RedeemCode;


}
