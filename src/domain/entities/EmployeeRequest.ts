import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,ManyToOne
} from "typeorm";
import { Clinic } from "./Clinic";
import { User } from "./User";


@Entity("employeeRequests")
export class EmployeeRequest {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "date", type: "date" })
    date!: Date;

    @Column({ name: "clinicId" })
    clinicId!: number;


    @Column({ name: "userId" })
    userId!: number;

    @Column({ name: "status", default: null })
    status!: boolean;

    @ManyToOne(() => Clinic, (clinic) => clinic.employmentRequests) 
    @JoinColumn({ name: "clinicId", referencedColumnName: "id" }) // Specify foreign key
    clinic!: Clinic;


    @ManyToOne(() => User, (user) => user.employmentRequests) 
    @JoinColumn({ name: "userId", referencedColumnName: "id" }) // Specify foreign key
    specilaist!: User;

}

