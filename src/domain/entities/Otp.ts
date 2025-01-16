import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,
    OneToMany,
    ManyToOne,
    Timestamp,
} from "typeorm";
import { User } from "./User";

@Entity("otps")
export class Otp {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "userId", nullable: false })
    userId!: number;

    @Column({ name: "token", nullable: false, unique: true })
    token!: number;

    @Column({ name: "expiredAt", type: "timestamp" })
    expiredAt!: Timestamp;

    @Column({ name: "verified", default: false })
    verified!: boolean;

    @ManyToOne(() => User, (user) => user.otps)
    @JoinColumn({ name: "userId", referencedColumnName: "id" }) // Specify foreign key
    user!: User;

  
}
