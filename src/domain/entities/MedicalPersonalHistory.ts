import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,ManyToOne
} from "typeorm";
import { MedicalRecord } from "./MedicalRecord";

@Entity("medicalPersonalHistories")
export class MedicalPersonalHistory {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "type", nullable: false })
    type!: string;

    @Column({ name: "description", type: "text", nullable: true })
    description!: string;
    
    @Column({ name: "medicalRecordId"})
    medicalRecordId!: number;

    @ManyToOne(() => MedicalRecord, (medicalRecord) => medicalRecord.medicalPersonalHistories)
    @JoinColumn({ name: "medicalRecordId", referencedColumnName: "id" }) // Specify foreign key
    medicalRecord!: MedicalRecord;

}
