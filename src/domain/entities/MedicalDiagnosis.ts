import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,ManyToOne
} from "typeorm";
import { MedicalRecord } from "./MedicalRecord";

@Entity("medicalDiagnosis")
export class MedicalDiagnosis {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "medicalRecordId"})
    medicalRecordId!: number;

    @Column({ name: "differentialDiagnosis", type: "text", nullable: true })
    differentialDiagnosis!: string;

    @Column({ name: "treatmentPlan", type: "text", nullable: true })
    treatmentPlan!: string;

    @ManyToOne(() => MedicalRecord, (medicalRecord) => medicalRecord.medicalDiagnosis)
    @JoinColumn({ name: "medicalRecordId", referencedColumnName: "id" }) // Specify foreign key
    medicalRecord!: MedicalRecord;


}
