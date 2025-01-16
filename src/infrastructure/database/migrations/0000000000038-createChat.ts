import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class CreateChat0000000000038 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "chats",
        columns: [
          {
            name: "id",
            type: "int",
                     isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "patientId",
            type: "int",
            isNullable: false,
          },
          {
            name: "specialistId",
            type: "int",
            isNullable: false,
          },
          {
            name: "isBlocked",
            type: "boolean",
            default: false,
          },

          {
            name: "channelName",
            type: "varchar",
            isNullable: true,
            isUnique: true,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "chats",
      new TableForeignKey({
        columnNames: ["patientId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
      })
    );

    await queryRunner.createForeignKey(
      "chats",
      new TableForeignKey({
        columnNames: ["specialistId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("chats", "FK_specialist_chats");
    await queryRunner.dropForeignKey("chats", "FK_patient_chats");

    await queryRunner.dropTable("chats");
  }
}
