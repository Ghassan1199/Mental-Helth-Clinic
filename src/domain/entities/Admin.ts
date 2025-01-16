import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,OneToMany,
    BeforeInsert
} from "typeorm";
import { RegistrationRequest } from "./RegistrationRequest";
import { WithdrawSpecialistRequest } from "./WithdrawSpecialistRequest";
import { ReportAction } from "./ReportAction";
import bcrypt from "bcrypt";

@Entity("admins")
export class Admin {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'fullName', length: 100 })
    fullName!: string;

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

    @Column({ name: "isSuper", default: false })
    isSuper!: boolean;

    @OneToMany(() => RegistrationRequest, (registrationRequest) => registrationRequest.admin, { cascade: true }) 
    registrationRequests!: RegistrationRequest[];

    @OneToMany(() => WithdrawSpecialistRequest, (withdrawSpecialistRequest) => withdrawSpecialistRequest.admin, { cascade: true }) 
    withdrawSpecialistRequests!: WithdrawSpecialistRequest[];

    @OneToMany(() => ReportAction, (reportAction) => reportAction.admin, { cascade: true }) 
    reportActions!: ReportAction[];

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
