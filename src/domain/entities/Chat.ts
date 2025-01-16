import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert, AfterInsert } from "typeorm";
import { User } from "./User";

@Entity("chats")
export class Chat {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "boolean", default: false })
  isBlocked!: boolean;

  @Column({ type: "varchar", length: 255, nullable: true })
  channelName!: string;

  @Column({ type: "int", })
  patientId!: number;

  @Column({ type: "int", })
  specialistId!: number;

  @ManyToOne(() => User, (user) => user.specialistChats)
  @JoinColumn({ name: "specialistId" })
  specialist!: User;

  @ManyToOne(() => User, (user) => user.patientChats)
  @JoinColumn({ name: "patientId" })
  patient!: User;

  @AfterInsert()
  setChannelName() {
    this.channelName = `chat-${this.id}`;
  }
}
