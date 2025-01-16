import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";


export class CreateReportAction0000000000023 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create reportActions table
        await queryRunner.createTable(new Table({
            name: "reportActions",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "date",
                    type: "date",
                },
                {
                    name: "response",
                    type: "text",
                },
                {
                    name: "reportId",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "adminId",
                    type: "int",
                    isNullable: false,
                },
            ],
        }));

        // Add foreign key constraint for reportId
        await queryRunner.createForeignKey("reportActions", new TableForeignKey({
            columnNames: ["reportId"],
            referencedColumnNames: ["id"],
            referencedTableName: "reports",
            onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
        }));

        // Add foreign key constraint for adminId
        await queryRunner.createForeignKey("reportActions", new TableForeignKey({
            columnNames: ["adminId"],
            referencedColumnNames: ["id"],
            referencedTableName: "admins",
            onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraints
        await queryRunner.dropForeignKey("reportActions", "FK_report_reportAction");
        await queryRunner.dropForeignKey("reportActions", "FK_admin_reportAction");

        // Drop reportActions table
        await queryRunner.dropTable("reportActions");
    }

}
