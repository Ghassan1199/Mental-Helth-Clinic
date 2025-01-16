import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,OneToMany,
    BeforeInsert,
    ManyToOne
} from "typeorm";
import { User } from "./User";


@Entity("botscores")
export class BotScore {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'score' })
    score!: string;

    @Column({ name: "userId", nullable: false })
    userId!: number;


    @ManyToOne(() => User, (user) => user.botScore) 
    @JoinColumn({ name: "userId", referencedColumnName: "id" })
    user!: User;
}
