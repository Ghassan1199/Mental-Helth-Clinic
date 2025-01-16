import { connectToDatabase } from "../../..";
import { DataSource, EntityManager } from "typeorm";
import { IRegistrationRepository } from "../../../../../domain/interfaces/repositories/registration/IRegistration.repository";
import { RegistrationRequest } from "../../../../../domain/entities/RegistrationRequest";
import { RegistrationRequestContent } from "../../../../../domain/entities/RegistrationRequestContent";
import { RegistrationRequestCategory } from "../../../../../domain/entities/RegistrationRequestCategory";
export class RegistrationMysqlRepository implements IRegistrationRepository {
    private client!: DataSource;

    constructor() {
        this.init();
    }
   async createRegistrationRequest(specialistId: number, roleId: number, latitude: string, longitude: string, clinicName: string,  cityId: number,
    address: string, entityManager?: EntityManager | undefined): Promise<RegistrationRequest> {
        if (entityManager){
            const record = entityManager.create(RegistrationRequest, {specialistId, date: new Date(), roleId, latitude, longitude, clinicName, cityId, address});
            return await entityManager.save(record);
        } 

        return await this.client.getRepository(RegistrationRequest).save({specialistId, date: new Date(), roleId, latitude, longitude, clinicName, cityId, address});
        }


    private async init() {
        this.client = await connectToDatabase();
    }

    async getAllForAdmin(): Promise<any[]> {
        const repository = this.client.getRepository(RegistrationRequest);
        return await repository.find({relations: ["registrationRequestContents", "registrationRequestCategories","specialist.specialistProfile", "city", "registrationRequestCategories.category"] });
        
    }
    async createRegistrationRequestContent(registrationRequestId: number, url: string, entityManager?: EntityManager | undefined): Promise<RegistrationRequestContent> {
        if (entityManager){
            const record = entityManager.create(RegistrationRequestContent, {url, registrationRequestId});
            return await entityManager.save(record);
        } 

        return await this.client.getRepository(RegistrationRequestContent).save({registrationRequestId, url});
        }

        async createRegistrationRequestCategory(registrationRequestId: number, categoryId: number, entityManager?: EntityManager | undefined): Promise<RegistrationRequestCategory> {
            if (entityManager){
                const record = entityManager.create(RegistrationRequestCategory, {categoryId, registrationRequestId});
                return await entityManager.save(record);
            } 
    
            return await this.client.getRepository(RegistrationRequestCategory).save({registrationRequestId, categoryId});
            }

    async getAll(where:any = {}, select:{}={}): Promise<RegistrationRequest[]> {


        
        return (await this.client.getRepository(RegistrationRequest).find({where, select,  order: {
            id: "DESC",
          }}));
    }


    async getOne(where:{}, select?:{}): Promise<RegistrationRequest | null> {

        const repository = this.client.getRepository(RegistrationRequest);
        return await repository.findOne({ where, relations: ["registrationRequestContents", "registrationRequestCategories"], select });
        
    }

   async updateRegistrationRequest(registrationRequest: RegistrationRequest, entityManager?:EntityManager): Promise<RegistrationRequest> {
        
    if(entityManager) return await entityManager.save(RegistrationRequest, registrationRequest);

    return await this.client.getRepository(RegistrationRequest).save(registrationRequest);
    }


   
}
