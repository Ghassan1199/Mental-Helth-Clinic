import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,ManyToOne
} from "typeorm";
import { MedicalRecord } from "./MedicalRecord";

@Entity("medicalConditions")
export class MedicalCondition {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "symptoms", type: "text", nullable: true })
    symptoms!: string;

    @Column({ name: "causes", type: "text", nullable: true })
    causes!: string;

    @Column({ name: "startDate", type: "date", nullable: true })
    startDate!: Date;

    
    @Column({ name: "medicalRecordId"})
    medicalRecordId!: number;


    @ManyToOne(() => MedicalRecord, (medicalRecord) => medicalRecord.medicalConditions)
    @JoinColumn({ name: "medicalRecordId", referencedColumnName: "id" }) // Specify foreign key
    medicalRecord!: MedicalRecord;

}
