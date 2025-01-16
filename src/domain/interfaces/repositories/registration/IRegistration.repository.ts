import { EntityManager } from "typeorm";
import { RegistrationRequest } from "../../../entities/RegistrationRequest";
import { RegistrationRequestContent } from "../../../entities/RegistrationRequestContent";
import { RegistrationRequestCategory } from "../../../entities/RegistrationRequestCategory";


export interface IRegistrationRepository {
    createRegistrationRequest(specialistId: number, roleId: number, latitude: string | null, longitude:string | null, clinicName: string | null, cityId: number | null,
        address: string | null, entityManager?: EntityManager): Promise<RegistrationRequest>;
    createRegistrationRequestContent(registrationRequestId: number, url: string, entityManager?: EntityManager): Promise<RegistrationRequestContent>;
    createRegistrationRequestCategory(registrationRequestId: number, categoryId: number, entityManager?: EntityManager): Promise<RegistrationRequestCategory>;
    getAll(where?:any, select?:{}): Promise<RegistrationRequest[]>;
    getOne( where?:{}, select?:{}): Promise<RegistrationRequest | null>;
    updateRegistrationRequest(registrationRequest: RegistrationRequest, entityManager?: EntityManager): Promise<RegistrationRequest>;


    getAllForAdmin(): Promise<any[]>
}
