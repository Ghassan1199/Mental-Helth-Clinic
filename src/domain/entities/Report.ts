import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,ManyToOne
} from "typeorm";
import { ReportAction } from "./ReportAction";
import { User } from "./User";
import { Appointment } from "./Appointment";
import { MedicalRecord } from "./MedicalRecord";

@Entity("reports")
export class Report {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "reporterId" })
    reporterId!: number;

    @Column({ name: "date", type: "date" })
    date!: Date;

    @Column({ name: "description", type: "text" })
    description!: string;

    @Column({ name: "appointmentId", nullable: true})
    appointmentId!: number;

    @Column({ name: "userId", nullable: true})
    userId!: number;

    @Column({ name: "medicalRecordId", nullable: true})
    medicalRecordId!: number;

    @Column({ name: "photo", nullable: true})
    photo!: string;


    @ManyToOne(
        () => Appointment,
        (appointment) => appointment.reports
    )
    @JoinColumn({ name: "appointmentId", referencedColumnName: "id" }) // Specify foreign key
    appointment!: Appointment;

    @OneToOne(() => ReportAction, (reportAction) => reportAction.report)
    reportAction?: ReportAction;

    @ManyToOne(() => User, (user) => user.reports)
    @JoinColumn({ name: "reporterId", referencedColumnName: "id" }) // Specify foreign key
    reporter!: User;

    @ManyToOne(() => User, (user) => user.userReports)
    @JoinColumn({ name: "userId", referencedColumnName: "id" }) // Specify foreign key
    reportedUser!: User;

    @ManyToOne(() => MedicalRecord, (medicalRecord) => medicalRecord.reports)
    @JoinColumn({ name: "medicalRecordId", referencedColumnName: "id" }) // Specify foreign key
    medicalRecord!: MedicalRecord;



}
