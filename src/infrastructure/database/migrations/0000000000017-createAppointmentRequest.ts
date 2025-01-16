import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class CreateAppointmentRequest0000000000017
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create appointmentRequests table
    await queryRunner.createTable(
      new Table({
        name: "appointmentRequests",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "status",
            type: "boolean",
            isNullable: true,
            default: null,
          },
          {
            name: "patientApprove",
            type: "boolean",
            isNullable: true,
            default: null,
          },

          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "specialistId",
            type: "int",
            isNullable: false,
          },
          {
            name: "userId",
            type: "int",
            isNullable: false,
          },
          {
            name: "proposedDate",
            type: "timestamp",
            isNullable: true,
          },
        ],
      })
    );

    // Add foreign key constraint for clinicId
    await queryRunner.createForeignKey(
      "appointmentRequests",
      new TableForeignKey({
        columnNames: ["specialistId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
      })
    );

    // Add foreign key constraint for userId
    await queryRunner.createForeignKey(
      "appointmentRequests",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints

    await queryRunner.dropForeignKey(
      "appointmentRequests",
      "FK_user_appointmentRequests"
    );
    await queryRunner.dropForeignKey(
      "appointmentRequests",
      "FK_specialist_appointmentRequests"
    );

    // Drop appointmentRequests table
    await queryRunner.dropTable("appointmentRequests");
  }
}
