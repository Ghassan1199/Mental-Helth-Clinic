import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";

export class CreateMedicalFamilyHistory0000000000033
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create medicalFamilyHistories table
        await queryRunner.createTable(
            new Table({
                name: "medicalFamilyHistories",
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
            })
        );

        // Add foreign key constraint for medicalRecordId
        await queryRunner.createForeignKey(
            "medicalFamilyHistories",
            new TableForeignKey({
                columnNames: ["medicalRecordId"],
                referencedColumnNames: ["id"],
                referencedTableName: "medicalRecords",
                onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraint
        await queryRunner.dropForeignKey(
            "medicalFamilyHistories",
            "FK_medicalRecord_medicalFamilyHistories"
        );

        // Drop medicalFamilyHistories table
        await queryRunner.dropTable("medicalFamilyHistories");
    }
}
