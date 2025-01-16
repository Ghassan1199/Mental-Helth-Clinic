import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class CreateSessionInfo0000000000020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create sessionInfo table
    await queryRunner.createTable(
      new Table({
        name: "sessionInfo",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "time",
            type: "varchar",
          },
          {
            name: "price",
            type: "decimal",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop sessionInfo table
    await queryRunner.dropTable("sessionInfo");
  }
}
