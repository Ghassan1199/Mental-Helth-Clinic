import { connectToDatabase } from "../../..";
import { DataSource } from "typeorm";
import { IAdminRepository } from "../../../../../domain/interfaces/repositories/admin/IAdminRepository";
import { Admin } from "../../../../../domain/entities/Admin";

export class AdminMysqlRepository implements IAdminRepository {
  private client!: DataSource;

  constructor() {
    this.init();
  }
  private async init() {
    this.client = await connectToDatabase();
  }

  async createAdmin(
    fullName: string,
    email: string,
    password: string,
    isSuper: boolean
  ): Promise<Admin> {
    const repo = this.client.getRepository(Admin);

    const admin = repo.create({ fullName, email, password, isSuper });
    return await repo.save(admin);
  }
  async getAdminById(id: number): Promise<Admin | null> {
    return await this.client.getRepository(Admin).findOne({
      where: {
        id,
      },
    });
  }

  async getAdminByEmail(email: string): Promise<Admin | null> {
    return await this.client.getRepository(Admin).findOne({
      where: {
        email,
      },
    });
  }
}
