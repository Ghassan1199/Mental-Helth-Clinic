import { EntityManager } from "typeorm";
import { Clinic } from "../../entities/Clinic";
import { User } from "../../entities/User";

export interface IClinicRepository {
    create(clinicName: string, doctorId: number, cityId: number, longitude: string, latitude: string, address: string, entityManager?: EntityManager): Promise<Clinic>;

    findById(clinicId: any): Promise<Clinic | null>;
    findByOwner(user: User): Promise<Clinic | null>;
    update(clinic: Clinic, entityManager?: EntityManager): Promise<Clinic | null>
    findAll(): Promise<Clinic[]>;
    getAllDoctors(): Promise<any[]>;
    getProfile(doctorId: number): Promise<any>;

}
