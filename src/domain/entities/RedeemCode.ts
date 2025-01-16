import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    ManyToOne,
} from "typeorm";
import { RedeemTransaction } from "./RedeemTransaction";

@Entity("redeemCodes")
export class RedeemCode {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "code", type: "varchar", length: 255 })
    code!: string;

    @Column({ name: "amount" , type: "float"})
    amount!: number;

    @Column({ name: "isUsed", default: false })
    isUsed!: boolean;

    @OneToOne(() => RedeemTransaction, (redeemTransaction) => redeemTransaction.redeemCode)
    redeemTransaction?: RedeemTransaction;

}
