import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class CreateUser0000000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "username",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "email",
            type: "varchar",
            length: "255",
            isUnique: true,
            isNullable: false,
          },
          {
            name: "password",
            type: "text",
          },
          {
            name: "isActive",
            type: "boolean",
            default: false,
          },
          {
            name: "isBlocked",
            type: "boolean",
            default: false,
          },
          {
            name: "blockCounter",
            type: "int",
            default: 0,
          },
          {
            name: "blockedUntil",
            type: "date",
            isNullable: true,
          },
          { name: "alertCounter", type: "int", default: 0 },

          {
            name: "isDeleted",
            type: "boolean",
            default: false,
          },
          {
            name: "deletedAt",
            type: "date",
            isNullable: true,
          },
          {
            name: "roleId",
            type: "int",
            default: 0,
          },
          {
            name: "deviceToken",
            type: "varchar",
            isNullable: true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users");
  }
}
