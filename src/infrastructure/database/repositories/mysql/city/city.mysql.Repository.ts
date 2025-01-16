import { connectToDatabase } from "../../..";
import { DataSource } from "typeorm";
import { ICityRepository } from "../../../../../domain/interfaces/repositories/city/ICityRepository";
import { City } from "../../../../../domain/entities/City";

export class CityMysqlRepository implements ICityRepository {
  private client!: DataSource;

  constructor() {
    this.init();
  } 
  async getCities(): Promise<City[]> {
    return await this.client.getRepository(City).find();
  }
  async createCity(name: string, eng: string      ): Promise<void> {
    await this.client.getRepository(City).save({ name, eng });
  }

  private async init() {
    this.client = await connectToDatabase();
  }
}
