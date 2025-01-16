import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,OneToMany,
    ManyToOne,
    Timestamp
} from "typeorm";
import { User } from "./User";

@Entity("blockings")
export class Blocking {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "doctorId" })
    doctorId!: number;

    @Column({ name: "userId" })
    userId!: number;

    @Column({ name: "blockedBy" })
    blockedBy!: boolean;

    @Column({ name: "date", type: "timestamp" })
    date!: Timestamp;
  


    @ManyToOne(() => User, (user) => user.doctorBlockings) 
    @JoinColumn({ name: "doctorId", referencedColumnName: "id" })
    doctor!: User;

    @ManyToOne(() => User, (user) => user.userBlockings) 
    @JoinColumn({ name: "userId", referencedColumnName: "id" })
    user!: User;

}
