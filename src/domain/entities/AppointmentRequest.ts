import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  ManyToOne,
  Timestamp,
} from "typeorm";
import { Clinic } from "./Clinic";
import { User } from "./User";

@Entity("appointmentRequests")
export class AppointmentRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "status", default: null })
  status!: boolean;

  @Column({ name: "specialistId", type: "int" })
  specialistId!: number;


  @Column({ name: "patientApprove", default: null })
  patientApprove!: boolean;

  @Column({ name: "description", type: "text" })
  description!: string;

  @Column({ name: "proposedDate", type: "timestamp", default: null })
  proposedDate!: Date;

  @Column({ name: "userId" })
  userId!: number;

  @ManyToOne(() => User, (user) => user.appointmentRequests)
  @JoinColumn({ name: "userId", referencedColumnName: "id" }) // Specify foreign key
  user!: User;

  @ManyToOne(() => User, (user) => user.appointmentRequests)
  @JoinColumn({ name: "specialistId", referencedColumnName: "id" }) // Specify foreign key
  specialist!: User;
}
