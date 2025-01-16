import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,
    BeforeInsert,
} from "typeorm";
import { Appointment } from "./Appointment";

@Entity("appointmentCancellations")
export class AppointmentCancellation {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "cancelledBy", type: "boolean" }) // false 0 user | true 1 user
    cancelledBy!: boolean;

    @Column({ name: "date", type: "timestamp" })
    date!: Date;

    @Column({ name: "description", type: "text" })
    description!: string;

    @OneToOne(
        () => Appointment,
        (appointment) => appointment.appointmentCancellation,
        { cascade: true }
    )
    @JoinColumn({ name: "appointmentId", referencedColumnName: "id" })
    appointment!: Appointment;

    @BeforeInsert()
    async hashPasswordBeforeInsert() {
        this.date = new Date();
    }

}
