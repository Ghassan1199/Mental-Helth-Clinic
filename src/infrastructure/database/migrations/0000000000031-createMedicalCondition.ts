import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";


export class CreateMedicalCondition0000000000031 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create medicalConditions table
        await queryRunner.createTable(new Table({
            name: "medicalConditions",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "symptoms",
                    type: "text",
                    isNullable: true,

                },
                {
                    name: "causes",
                    type: "text",
                    isNullable: true,

                },
                {
                    name: "startDate",
                    type: "date",
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
        await queryRunner.createForeignKey("medicalConditions", new TableForeignKey({
            columnNames: ["medicalRecordId"],
            referencedColumnNames: ["id"],
            referencedTableName: "medicalRecords",
            onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraint
        await queryRunner.dropForeignKey("medicalConditions", "FK_medicalRecord_medicalConditions");

        // Drop medicalConditions table
        await queryRunner.dropTable("medicalConditions");
    }

}
