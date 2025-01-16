import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,
    ManyToOne,
} from "typeorm";
import { User } from "./User";

@Entity("userProfiles")
export class UserProfile {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "dateOfBirth", type: "date" })
    dateOfBirth!: Date;

    @Column({ name: "gender", type: "boolean" })
    gender!: boolean;

    @Column({ name: "fullName", length: 100 , default: "Anonymous"})
    fullName!: string;

    @Column({
        name: "maritalStatus",
        type: "enum",
        enum: ["Single", "Married", "Divorced", "Widowed"],
    })
    maritalStatus!: string;

    @Column({ name: "children", default: 0 })
    children!: number;

    @Column({ name: "profession", length: 100 })
    profession!: string;

    @Column({ name: "hoursOfWork" })
    hoursOfWork!: number;

    @Column({ name: "placeOfWork", length: 100 })
    placeOfWork!: string;



    @OneToOne(() => User, (user) => user.userProfile, { cascade: true })
    @JoinColumn({ name: "userId", referencedColumnName: "id" })
    user!: User;
}
