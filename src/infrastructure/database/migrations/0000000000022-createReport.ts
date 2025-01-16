import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";


export class CreateReport0000000000022 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create reports table
        await queryRunner.createTable(new Table({
            name: "reports",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "reporterId",
                    type: "int",
                },
                {
                    name: "date",
                    type: "date",
                },
                {
                    name: "description",
                    type: "text",
                },
                {
                    name: "appointmentId",
                    type: "int",
                    isNullable: true,
                },
                {
                    name: "userId",
                    type: "int",
                    isNullable: true,
                },
                {
                    name: "medicalRecordId",
                    type: "int",
                    isNullable: true,
                },
                {
                    name: "photo",
                    type: "text",
                    isNullable: true,
                },

            ],
        }));

        // Add foreign key constraint for sessionId
        await queryRunner.createForeignKey("reports", new TableForeignKey({
            columnNames: ["appointmentId"],
            referencedColumnNames: ["id"],
            referencedTableName: "appointments",
            onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
        }));

        await queryRunner.createForeignKey("reports", new TableForeignKey({
            columnNames: ["reporterId"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
        }));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraint
        await queryRunner.dropForeignKey("reports", "FK_appointment_reports");
        await queryRunner.dropForeignKey("reports", "FK_user_reports");

        // Drop reports table
        await queryRunner.dropTable("reports");
    }


}
