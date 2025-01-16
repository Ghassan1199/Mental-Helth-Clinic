import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,
    OneToMany,
} from "typeorm";
import { SpecialistCategory } from "./SpecialistCategory";
import { Certificate } from "./Certificate";
import { User } from "./User";

@Entity("specialistProfiles")
export class SpecialistProfile {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "fullName", length: 100 })
    fullName!: string;

    @Column({ name: "dateOfBirth", type: "date" })
    dateOfBirth!: Date;

    @Column({ name: "gender", type: "boolean" })
    gender!: boolean;

    @Column({ name: "photo", type: "text" })
    photo!: string;

    @Column({ name: "phone", nullable: false, unique: true })
    phone!: number;

    @Column({ name: "status",  length: 20, default: "unverified" })
    status!: string;

    @Column({ name: "userId", nullable: false })
    userId!: number;

    @Column({ name: "studyInfo", type: "text", nullable: true, default: null })
    studyInfo!: string;

    
    @Column({ name: "specInfo", type: "text", nullable: true, default: null })
    specInfo!: string;

    @OneToOne(() => User, (user) => user.specialistProfile, { cascade: true })
    @JoinColumn({ name: "userId", referencedColumnName: "id" })
    user!: User;
    
    @OneToMany(() => Certificate, (certificate) => certificate.specialistProfile, { cascade: true }) 
    certificates?: Certificate[];


    @OneToMany(() => SpecialistCategory, (specialistCategory) => specialistCategory.specialistProfile, { cascade: true }) 
    specialistCategories?: SpecialistCategory[];

}
