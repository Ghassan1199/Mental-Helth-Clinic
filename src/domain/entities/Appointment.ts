import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  ManyToOne,
  Timestamp,
  OneToMany,
} from "typeorm";
import { Clinic } from "./Clinic";
import { User } from "./User";
import { AppointmentCancellation } from "./AppointmentCancellation";
import { Transaction } from "./Transaction";
import { Report } from "./Report";

@Entity("appointments")
export class Appointment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "date", type: "timestamp" })
  date!: Timestamp;

  @Column({ name: "isCancelled", default: false })
  isCancelled!: boolean;

  @Column({ name: "price" })
  price!: string;

  @Column({ name: "isCompleted", default: false })
  isCompleted!: boolean;

  @Column({ name: "completedBySpec", default: false })
  completedBySpec!: boolean;

  @Column({ name: "completedByUser", default: false })
  completedByUser!: boolean;

  @Column({ name: "specialistId", type: "int" })
  specialistId!: number;

  @Column({ name: "isNotified", default: false })
  isNotified!: boolean;

  @Column({ name: "userId", type: "int" })
  userId!: number;

  @ManyToOne(() => User, (user) => user.appointmentRequests)
  @JoinColumn({ name: "specialistId", referencedColumnName: "id" }) // Specify foreign key
  specialist!: User;

  @ManyToOne(() => User, (user) => user.appointments)
  @JoinColumn({ name: "userId", referencedColumnName: "id" }) // Specify foreign key
  user!: User;

  @OneToMany(() => Transaction, (transaction) => transaction.appointment, {
    cascade: true,
  })
  transactions?: Transaction[];

  @OneToMany(() => Report, (report) => report.appointment, { cascade: true })
  reports?: Report[];

  @OneToOne(
    () => AppointmentCancellation,
    (appointmentCancellation) => appointmentCancellation.appointment
  )
  appointmentCancellation?: AppointmentCancellation;
}
