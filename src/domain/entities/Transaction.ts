import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,
    ManyToOne,
    BeforeInsert,
} from "typeorm";
import { Wallet } from "./Wallet";
import { Appointment } from "./Appointment";

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "amount", type: "float" })
  amount!: number;

  @Column({ name: "date", type: "timestamp" })
  date!: Date;

  @ManyToOne(() => Wallet, (specialistWallet) => specialistWallet.transactions)
  @JoinColumn({ name: "specialistWalletId", referencedColumnName: "id" }) // Specify foreign key
  specialistWallet!: Wallet;

  @ManyToOne(() => Wallet, (userWallet) => userWallet.transactions)
  @JoinColumn({ name: "userWalletId", referencedColumnName: "id" }) // Specify foreign key
  userWallet!: Wallet;

  @ManyToOne(() => Appointment, (appointment) => appointment.transactions)
  @JoinColumn({ name: "appointmentId", referencedColumnName: "id" }) // Specify foreign key
  appointment!: Appointment;

  @BeforeInsert()
  async setDate() {
    this.date = new Date(); // Hash the password with bcrypt
  }
}
