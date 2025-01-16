import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import bcrypt from "bcrypt";

import { UserProfile } from "./UserProfile";
import { Rate } from "./Rate";
import { AppointmentRequest } from "./AppointmentRequest";
import { Appointment } from "./Appointment";
import { MedicalRecord } from "./MedicalRecord";
import { Clinic } from "./Clinic";
import { Employee } from "./Employee";
import { RegistrationRequest } from "./RegistrationRequest";
import { Report } from "./Report";
import { WithdrawSpecialistRequest } from "./WithdrawSpecialistRequest";
import { Wallet } from "./Wallet";
import { Otp } from "./Otp";
import { SpecialistProfile } from "./SpecialistProfile";
import { EmployeeRequest } from "./EmployeeRequest";
import { Chat } from "./Chat";
import { Assignment } from "./Assignment";
import { BotScore } from "./BotScore";
import { Blocking } from "./Blocking";
import { OAuth } from "./OAuth";
import { Notification } from "./Notification";
@Entity("users")
export class            User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "username", type: "varchar", length: 255, nullable: false })
  username!: string;

  @Column({
    name: "email",
    type: "varchar",
    length: 255,
    unique: true,
    nullable: false,
  })
  email!: string;

  @Column({ name: "password", type: "text" })
  password!: string;

  @Column({ name: "isActive", default: false })
  isActive!: boolean;

  @Column({ name: "isBlocked", default: false })
  isBlocked!: boolean;

  @Column({ name: "blockCounter", default: 0 })
  blockCounter!: number;

  @Column({ name: "blockedUntil", type: "date", nullable: true })
  blockedUntil?: Date | null;

  @Column({ name: "alertCounter", default: 0 })
  alertCounter!: number;

  @Column({ name: "isDeleted", type: "boolean", default: false })
  isDeleted!: boolean;

  @Column({ name: "deletedAt", type: "date", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "roleId", default: 0 }) // 0 user | 1 doctor | 2 specialist
  roleId!: number;

  @Column({
    name: "deviceToken",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  deviceToken!: string;

  @OneToOne(() => UserProfile, (userProfile) => userProfile.user)
  userProfile?: UserProfile;

  @OneToOne(() => OAuth, (oAuth) => oAuth.user)
  oAuth?: OAuth;

  @OneToOne(
    () => SpecialistProfile,
    (specialistProfile) => specialistProfile.user
  ) 
  specialistProfile?: SpecialistProfile;

  @OneToMany(() => Rate, (rate) => rate.user, { cascade: true }) // Cascade on save/delete
  rates?: Rate[];

  @OneToMany(
    () => AppointmentRequest,
    (appointmentRequest) => appointmentRequest.user,
    { cascade: true }
  )
  appointmentRequests!: AppointmentRequest[];

  @OneToMany(() => Appointment, (appointment) => appointment.user, {
    cascade: true,
  })
  appointments!: Appointment[];

  @OneToOne(() => Wallet, (wallet) => wallet.user)
  wallet?: Wallet;

  @OneToMany(() => MedicalRecord, (medicalRecord) => medicalRecord.user, {
    cascade: true,
  })
  medicalRecords?: MedicalRecord[];

  @OneToOne(() => Clinic, (clinic) => clinic.doctor, { cascade: true })
  clinic?: Clinic;

  @OneToOne(() => Employee, (employee) => employee.user, { cascade: true })
  employee?: Employee;

  @OneToMany(
    () => RegistrationRequest,
    (registrationRequest) => registrationRequest.specialist,
    { cascade: true }
  )
  registrationRequests?: RegistrationRequest[];

  @OneToMany(() => Report, (report) => report.reporter, { cascade: true })
  reports?: Report[];

  @OneToMany(() => Report, (report) => report.reportedUser, { cascade: true })
  userReports?: Report[];

  @OneToMany(() => Otp, (otp) => otp.user, { cascade: true })
  otps?: Otp[];

  @OneToMany(() => Chat, (chat) => chat.specialist, { cascade: true })
  specialistChats?: Chat[];

  @OneToMany(() => Chat, (chat) => chat.patient, { cascade: true })
  patientChats?: Chat[];

  @OneToOne(
    () => EmployeeRequest,
    (employeeRequest) => employeeRequest.specilaist
  )
  employmentRequests!: EmployeeRequest;

  @OneToMany(
    () => WithdrawSpecialistRequest,
    (withdrawSpecialistRequest) => withdrawSpecialistRequest.specialist,
    { cascade: true }
  )
  withdrawSpecialistRequests?: WithdrawSpecialistRequest[];

  @OneToMany(
    () => Assignment,
    (specAssignments) => specAssignments.specialist,
    { cascade: true }
  )
  specAssignments?: Assignment[];

  @OneToMany(() => Assignment, (userAssignments) => userAssignments.user, {
    cascade: true,
  })
  userAssignments?: Assignment[];

  @OneToMany(() => BotScore, (botScore) => botScore.user, {
    cascade: true,
  })
  botScore?: BotScore[];

  @OneToMany(() => Blocking, (blocking) => blocking.user, {
    cascade: true,
  })
  userBlockings?: Blocking[];

  @OneToMany(() => Blocking, (blocking) => blocking.doctor, {
    cascade: true,
  })
  doctorBlockings?: Blocking[];

  @OneToMany(() => Notification, (notification) => notification.user, { cascade: true })
  notifications?: Notification[];
  
  // Method to hash the password before inserting the entity
  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    this.password = await bcrypt.hash(this.password, 10); // Hash the password with bcrypt
  }

  @BeforeInsert()
  async generateUsername() {
    // Derive the username from the email address
    const emailParts = this.email.split("@");
    this.username = emailParts[0];
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}
