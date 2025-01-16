import { connectToDatabase } from "../../..";
import { DataSource, EntityManager } from "typeorm";
import { ICertificateRepository } from "../../../../../domain/interfaces/repositories/certifications/ICertificatesRepository";
import { Certificate } from "../../../../../domain/entities/Certificate";

export class CertificateMysqlRepository implements ICertificateRepository {
  private client!: DataSource;

  constructor() {
    this.init();
  }

  private async init() {
    this.client = await connectToDatabase();
  }

  async createCertificate(
    specialistProfileId: number,
    url: string,
    entityManager?: EntityManager | undefined
  ): Promise<void> {
    if (entityManager) {
      await entityManager.save(Certificate, {
        specialistProfileId,
        url,
      });
    } else {
      await this.client.getRepository(Certificate).save({ specialistProfileId, url });
    }
  }
}
