import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,OneToMany
} from "typeorm";
import { SpecialistCategory } from "./SpecialistCategory";
import { RegistrationRequestCategory } from "./RegistrationRequestCategory";

@Entity("categories")
export class Category {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "name", type: "varchar", length: 255 })
    name!: string;

    
    @Column({ name: "eng", type: "varchar" })
    eng!: string;
    
    @OneToMany(() => SpecialistCategory, (specialistCategory) => specialistCategory.category, { cascade: true }) 
    specialistCategories?: SpecialistCategory[];



    @OneToMany(
        () => RegistrationRequestCategory,
        (registrationRequestCategory) =>
            registrationRequestCategory.registrationRequest,
        { cascade: true }
    ) // Cascade on save/delete
    registrationRequestCategories?: RegistrationRequestCategory[];

}
