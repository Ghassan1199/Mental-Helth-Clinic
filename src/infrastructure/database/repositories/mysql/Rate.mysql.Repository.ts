import { connectToDatabase } from "../../";
import { DataSource, EntityManager } from "typeorm";
import { IRateRepository } from "../../../../domain/interfaces/repositories/IRateRepository";
import { Rate } from "../../../../domain/entities/Rate";
import { Clinic } from "../../../../domain/entities/Clinic";
import { User } from "../../../../domain/entities/User";

export class RateMysqlRepository   implements IRateRepository {
    private client!: DataSource;

    constructor() {
        this.init();
    }
    private async init() {
        this.client = await connectToDatabase();
    }

    async create(clinic:Clinic , user:User , value : number
    ): Promise<Rate> {
        const repository = this.client.getRepository(Rate);
        const record = repository.create({
            user: user,
            clinic: clinic,
            value: value,
        });
        const savedRate = await repository.save(record);
        return savedRate;
    }

    async getAverageRateByClinic(clinic: Clinic): Promise<number> {
        const repository = this.client.getRepository(Rate);

        const { avg } = await repository.createQueryBuilder("rate")
            .select("AVG(rate.value)", "avg")
            .where("rate.clinicId = :clinicId", { clinicId: clinic.id })
            .getRawOne();

        return parseFloat(avg) || 0;
    }
}
