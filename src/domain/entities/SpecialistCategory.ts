import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,ManyToOne
} from "typeorm";
import { Category } from "./Category";
import { SpecialistProfile } from "./SpecialistProfile";

@Entity("specialistCategories")
export class SpecialistCategory {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "specialistProfileId" })
    specialistProfileId!: number;

    @Column({ name: "categoryId" })
    categoryId!: number;


    @ManyToOne(() => SpecialistProfile, (specialistProfile) => specialistProfile.specialistCategories)
    @JoinColumn({ name: "specialistProfileId", referencedColumnName: "id" }) // Specify foreign key
    specialistProfile!: SpecialistProfile;

    @ManyToOne(() => Category, (category) => category.specialistCategories)
    @JoinColumn({ name: "categoryId", referencedColumnName: "id" }) // Specify foreign key
    category!: Category;


}

