import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";


export class CreateMedicalPersonalHistory0000000000034 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create medicalPersonalHistories table
        await queryRunner.createTable(new Table({
            name: "medicalPersonalHistories",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "type",
                    type: "varchar",
                    isNullable: true,
                },
                {
                    name: "description",
                    type: "text",
                    isNullable: true,
                },
                {
                    name: "medicalRecordId",
                    type: "int",
                    isNullable: false,
                },
            ],
        }));

        // Add foreign key constraint for medicalRecordId
        await queryRunner.createForeignKey("medicalPersonalHistories", new TableForeignKey({
            columnNames: ["medicalRecordId"],
            referencedColumnNames: ["id"],
            referencedTableName: "medicalRecords",
            onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraint
        await queryRunner.dropForeignKey("medicalPersonalHistories", "FK_medicalRecord_medicalPersonalHistories");

        // Drop medicalPersonalHistories table
        await queryRunner.dropTable("medicalPersonalHistories");
    }

}
