import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class CreateAssignment0000000000020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create assignment table
    await queryRunner.createTable(
      new Table({
        name: "assignments",
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
          },
          {
            name: "specId",
            type: "int",
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      "assignments",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
      }),
    );

    await queryRunner.createForeignKey(
      "assignments",
      new TableForeignKey({
        columnNames: ["specId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
      }),
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop assignments table
    await queryRunner.dropTable("assignments");
  }
}
