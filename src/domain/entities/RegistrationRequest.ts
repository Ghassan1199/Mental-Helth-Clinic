import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,
    ManyToOne,
    OneToMany,
} from "typeorm";
import { Admin } from "./Admin";
import { RegistrationRequestContent } from "./RegistrationRequestContent";
import { RegistrationRequestCategory } from "./RegistrationRequestCategory";
import { User } from "./User";
import { City } from "./City";

@Entity("registrationRequests")
export class RegistrationRequest {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "status", default: null })
    status!: boolean;

    @Column({ name: "description", type: "text", default: null })
    description!: string;

    @Column({ name: "date", type: "date" })
    date!: Date;

    @Column({ name: "specialistId" })
    specialistId!: number;

    @Column({ name: "clinicName", type: "varchar", length: 255, nullable: true, default: null })
    clinicName!: string;

    @Column({
        name: "latitude",
        type: "varchar",
        nullable: true,
        default: null
    })
    latitude!: string;

    @Column({
        name: "longitude",
        type: "varchar",
        nullable: true,
        default: null
    })
    longitude!: string;


    @Column({ name: "roleId" })
    roleId!: number;

    @Column({ name: "cityId", nullable: true, default: null })
    cityId!: number;

    @Column({ name: "address", type: "text", nullable: true, default: null })
    address!: string;

    @ManyToOne(
        () => User,
        (user) => user.registrationRequests
    )
    @JoinColumn({ name: "specialistId", referencedColumnName: "id" }) // Specify foreign key
    specialist!: User;

    @ManyToOne(() => Admin, (admin) => admin.registrationRequests)
    @JoinColumn({ name: "adminId", referencedColumnName: "id" }) // Specify foreign key
    admin!: Admin;

    @OneToMany(
        () => RegistrationRequestContent,
        (registrationRequestContent) =>
            registrationRequestContent.registrationRequest,
        { cascade: true }
    ) // Cascade on save/delete
    registrationRequestContents?: RegistrationRequestContent[];

    @OneToMany(
        () => RegistrationRequestCategory,
        (registrationRequestCategory) =>
            registrationRequestCategory.registrationRequest,
        { cascade: true }
    ) // Cascade on save/delete
    registrationRequestCategories?: RegistrationRequestCategory[];


    @ManyToOne(() => City, (city) => city.registrationRequests)
    @JoinColumn({ name: "cityId", referencedColumnName: "id" })
    city!: City;
}


