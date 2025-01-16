import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";


export class CreateMedicalDiagnosis0000000000032 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create medicalDiagnosis table
        await queryRunner.createTable(new Table({
            name: "medicalDiagnosis",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "differentialDiagnosis",
                    type: "text",
                    isNullable: true,

                },
                {
                    name: "treatmentPlan",
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
        await queryRunner.createForeignKey("medicalDiagnosis", new TableForeignKey({
            columnNames: ["medicalRecordId"],
            referencedColumnNames: ["id"],
            referencedTableName: "medicalRecords",
            onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraint
        await queryRunner.dropForeignKey("medicalDiagnosis", "FK_medicalRecord_medicalDiagnosis");

        // Drop medicalDiagnosis table
        await queryRunner.dropTable("medicalDiagnosis");
    }

}
