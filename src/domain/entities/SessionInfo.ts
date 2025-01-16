import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("sessionInfo")
export class SessionInfo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "time" })
  time!: string;

  @Column({ name: "price" })
  price!: number;
}
