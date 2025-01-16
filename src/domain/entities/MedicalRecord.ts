import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,ManyToOne,OneToMany,
    CreateDateColumn,
    BeforeInsert
} from "typeorm";
import { User } from "./User";
import { MedicalCondition } from "./MedicalCondition";
import { MedicalFamilyHistory } from "./MedicalFamilyHistory";
import { MedicalPersonalHistory } from "./MedicalPersonalHistory";
import { MedicalDiagnosis } from "./MedicalDiagnosis";
import { Report } from "./Report";


@Entity("medicalRecords")
export class MedicalRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "mainComplaint", type: "text", nullable: true })
  MainComplaint!: string;

  @CreateDateColumn({ name: "createdAt" })
  createdAt!: Date;

  @Column({ name: "doctorId" })
  doctorId!: number;

  @Column({ name: "userId" })
  userId!: number;

  @ManyToOne(() => User, (doctor) => doctor.medicalRecords)
  @JoinColumn({ name: "doctorId", referencedColumnName: "id" }) // Specify foreign key
  doctor!: User;

  @ManyToOne(() => User, (user) => user.medicalRecords)
  @JoinColumn({ name: "userId", referencedColumnName: "id" }) // Specify foreign key
  user!: User;

  @OneToMany(
    () => MedicalCondition,
    (medicalCondition) => medicalCondition.medicalRecord,
    { cascade: true }
  )
  medicalConditions?: MedicalCondition[];

  @OneToMany(
    () => MedicalFamilyHistory,
    (medicalFamilyHistory) => medicalFamilyHistory.medicalRecord,
    { cascade: true }
  )
  medicalFamilyHistories?: MedicalFamilyHistory[];

  @OneToMany(
    () => MedicalPersonalHistory,
    (medicalPersonalHistory) => medicalPersonalHistory.medicalRecord,
    { cascade: true }
  )
  medicalPersonalHistories?: MedicalPersonalHistory[];

  @OneToMany(
    () => MedicalDiagnosis,
    (medicalDiagnosis) => medicalDiagnosis.medicalRecord,
    { cascade: true }
  )
  medicalDiagnosis?: MedicalDiagnosis[];

  @OneToMany(() => Report, (report) => report.medicalRecord, { cascade: true })
  reports?: Report[]


}
