import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  BeforeInsert,
} from "typeorm";
import { User } from "./User";

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ name: "title", type: "varchar", length: 255, nullable: true })
  title!: string;

  @Column({ name: "content", type: "varchar", length: 255, nullable: true })
  content!: string;

  @Column({ name: "status", type: "boolean", nullable: true })
  status!: boolean; // opened or not

  @CreateDateColumn({ name: "createdAt" })
  createdAt!: Date;

  @Column({ name: "userId" })
  userId!: number;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: "userId", referencedColumnName: "id" }) // Specify foreign key
  user!: User;
}
