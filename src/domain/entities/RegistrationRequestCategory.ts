import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,
    ManyToOne,
    ManyToMany,
} from "typeorm";
import { RegistrationRequest } from "./RegistrationRequest";
import { Category } from "./Category";

@Entity("registrationRequestCategories")
export class RegistrationRequestCategory {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "categoryId" })
    categoryId!: number;
    
    @Column({ name: "registrationRequestId" })
    registrationRequestId!: number;
    
    @ManyToOne(
        () => RegistrationRequest,
        (registrationRequest) => registrationRequest.registrationRequestCategories
    )
    @JoinColumn({ name: "registrationRequestId", referencedColumnName: "id" }) // Specify foreign key
    registrationRequest!: RegistrationRequest;


    @ManyToOne(
        () => Category,
        (category) => category.registrationRequestCategories
    )
    @JoinColumn({ name: "categoryId", referencedColumnName: "id" }) // Specify foreign key
    category!: Category;
}
