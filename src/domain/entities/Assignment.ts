import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  BeforeInsert,
} from "typeorm";

import { User } from "./User";

@Entity("assignments")
export class Assignment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "userId" })
  userId!: number;

  @Column({ name: "specId" })
  specId!: number;

  @ManyToOne(() => User, (user) => user.specAssignments)
  @JoinColumn({ name: "specId", referencedColumnName: "id" })
  specialist!: User;

  @ManyToOne(() => User, (user) => user.userAssignments)
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  user!: User;
}
