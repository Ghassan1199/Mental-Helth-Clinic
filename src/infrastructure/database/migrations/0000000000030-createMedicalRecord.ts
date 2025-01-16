import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";


export class CreateMedicalRecord0000000000030 implements MigrationInterface {
                                
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create medicalRecords table
        await queryRunner.createTable(
          new Table({
            name: "medicalRecords",
            columns: [
              {
                name: "id",
                type: "int",
                isPrimary: true,
                isGenerated: true,
                generationStrategy: "increment",
              },
              {
                name: "mainComplaint",
                type: "text",
                isNullable: true,
              },
              {
                name: "doctorId",
                type: "int",
                isNullable: false,
              },
              {
                name: "userId",
                type: "int",
                isNullable: false,
              },
              {
                name: "createdAt",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
              },
            ],
          })
        );

        // Add foreign key constraint for doctorId
        await queryRunner.createForeignKey("medicalRecords", new TableForeignKey({
            columnNames: ["doctorId"],

            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
        }));

        // Add foreign key constraint for userId
        await queryRunner.createForeignKey("medicalRecords", new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraints
        await queryRunner.dropForeignKey("medicalRecords", "FK_doctor_medicalRecords");
        await queryRunner.dropForeignKey("medicalRecords", "FK_user_medicalRecords");

        // Drop medicalRecords table
        await queryRunner.dropTable("medicalRecords");
    }

}
