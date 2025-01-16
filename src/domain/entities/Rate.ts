import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,
    ManyToOne,
} from "typeorm";
import { User } from "./User";
import { Clinic } from "./Clinic";

@Entity("rates")
export class Rate {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "value", type: "float" })
    value!: number;

    @ManyToOne(() => User, (user) => user.rates) // Cascade on delete
    @JoinColumn({ name: "userId", referencedColumnName: "id" }) // Specify foreign key
    user!: User;

    @ManyToOne(() => Clinic, (clinic) => clinic.rates) // Cascade on delete
    @JoinColumn({ name: "clinicId", referencedColumnName: "id" }) // Specify foreign key
    clinic?: Clinic;
}
