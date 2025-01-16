import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,ManyToOne
} from "typeorm";
import { Clinic } from "./Clinic";
import { User } from "./User";

@Entity("employees")
export class Employee {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "date", type: "date" })
    date!: Date;

    @Column({ name: "clinicId" })
    clinicId!: number;

    @Column({ name: "userId" })
    userId!: number;

    @ManyToOne(() => Clinic, (clinic) => clinic.employees) 
    @JoinColumn({ name: "clinicId", referencedColumnName: "id" }) // Specify foreign key
    clinic!: Clinic;


    @OneToOne(() => User, (user) => user.employee)
    @JoinColumn({ name: "userId", referencedColumnName: "id" })
    user!: User;



}

