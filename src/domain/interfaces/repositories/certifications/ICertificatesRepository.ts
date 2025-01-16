import { EntityManager } from "typeorm";



export interface ICertificateRepository {
    createCertificate(specialistProfileId: number, url: string, entityManager?: EntityManager): Promise<void>;

}
