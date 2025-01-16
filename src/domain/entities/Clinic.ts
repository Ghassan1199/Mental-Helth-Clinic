import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,
    OneToMany,
    ManyToOne,
} from "typeorm";
import { Rate } from "./Rate";
import { Appointment } from "./Appointment";
import { AppointmentRequest } from "./AppointmentRequest";
import { Employee } from "./Employee";
import { User } from "./User";
import { City } from "./City";
import { EmployeeRequest } from "./EmployeeRequest";

@Entity("clinics")
export class Clinic {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "name", type: "varchar", length: 255, nullable: false })
    name!: string;

    @Column({ name: "totalRate", nullable: true, default:0 })
    totalRate!: number;

    @Column({ name: "doctorId", nullable: false })
    doctorId!: number;

    @Column({ name: "cityId", nullable: false })
    cityId!: number;

    @Column({ name: "address", type: "text", nullable: false })
    address!: string;

    @Column({
        name: "latitude",
        type: "varchar",
        nullable: true,
    })
    latitude!: string;

    @Column({
        name: "longitude",
        type: "varchar",
        nullable: true,
    })
    longitude!: string;

    // @Column({ name: "isVerified", type: "boolean" }) 
    // isVerified!: boolean;


    @OneToMany(() => Rate, (rate) => rate.clinic, { cascade: true }) 
    rates!: Rate[];

    @OneToMany(() => Employee, (employee) => employee.clinic, { cascade: true }) 
    employees!: Employee[];
    
    @OneToOne(() => User, (user) => user.clinic)
    @JoinColumn({ name: "doctorId", referencedColumnName: "id" })
    doctor!: User;


    @OneToOne(() => City, (city) => city.clinics)
    @JoinColumn({ name: "cityId", referencedColumnName: "id" })
    city!: City;

    @OneToOne(() => EmployeeRequest, (employeeRequest) => employeeRequest.clinic)
    employmentRequests!: EmployeeRequest;






}
