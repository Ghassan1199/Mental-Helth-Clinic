import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,
    ManyToOne,
} from "typeorm";
import { RegistrationRequest } from "./RegistrationRequest";

@Entity("registrationRequestContents")
export class RegistrationRequestContent {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "url", type: "text" })
    url!: string;
    
    @Column({ name: "registrationRequestId" })
    registrationRequestId!: number;
    @ManyToOne(
        () => RegistrationRequest,
        (registrationRequest) => registrationRequest.registrationRequestContents
    )
    @JoinColumn({ name: "registrationRequestId", referencedColumnName: "id" }) // Specify foreign key
    registrationRequest!: RegistrationRequest;
}
