import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,
    OneToMany,
} from "typeorm";
import { Clinic } from "./Clinic";
import { RegistrationRequest } from "./RegistrationRequest";

@Entity("cities")
export class City {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "name", type: "varchar" })
    name!: string;


    @Column({ name: "eng", type: "varchar" })
    eng!: string;


    @OneToMany(() => Clinic, (clinic) => clinic.city, {
        cascade: true,
    })
    clinics?: Clinic[];

    
    @OneToMany(() => RegistrationRequest, (registrationRequests) => registrationRequests.city, {
        cascade: true,
    })
    registrationRequests?: RegistrationRequest[];
}
