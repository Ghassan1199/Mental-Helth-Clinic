import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,
    ManyToOne,
} from "typeorm";
import { Report } from "./Report";
import { Admin } from "./Admin";

@Entity("reportActions")
export class ReportAction {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "date", type: "date" })
    date!: Date;

    @Column({ name: "response", type: "text" })
    response!: string;

    @OneToOne(() => Report, (report) => report.reportAction, { cascade: true })
    @JoinColumn({ name: "reportId", referencedColumnName: "id" })
    report!: Report;

    @ManyToOne(() => Admin, (admin) => admin.reportActions)
    @JoinColumn({ name: "adminId", referencedColumnName: "id" }) // Specify foreign key
    admin!: Admin;
}
