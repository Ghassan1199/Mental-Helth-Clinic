import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,ManyToOne
} from "typeorm";
import { SpecialistProfile } from "./SpecialistProfile";

@Entity("certificates")
export class Certificate {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "url", type: "text" })
    url!: string;

    @Column({ name: "specialistProfileId"})
    specialistProfileId!: number;

    @ManyToOne(() => SpecialistProfile, (specialistProfile) => specialistProfile.certificates) 
    @JoinColumn({ name: "specialistProfileId", referencedColumnName: "id" }) // Specify foreign key
    specialistProfile!: SpecialistProfile;


}
