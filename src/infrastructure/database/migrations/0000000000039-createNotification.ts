import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class CreateNotification0000000000039 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "notifications",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "userId",
            type: "int",
            isNullable: false,
          },
          {
            name: "title",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "content",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "status",
            type: "boolean",
            default: false,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "isNotified",
            type: "boolean",
            default: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "notifications",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("notifications", "FK_user_notifications");
    await queryRunner.dropTable("notifications");
  }
}
