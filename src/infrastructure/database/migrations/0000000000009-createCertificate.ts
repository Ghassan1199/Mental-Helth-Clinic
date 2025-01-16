import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";


export class CreateCertificate0000000000009 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create certificates table
        await queryRunner.createTable(new Table({
            name: "certificates",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "url",
                    type: "text",
                },
                {
                    name: "specialistProfileId",
                    type: "int",
                    isNullable: false,
                },
            ],
        }));

        // Add foreign key constraint for specialistId
        await queryRunner.createForeignKey("certificates", new TableForeignKey({
            columnNames: ["specialistProfileId"],
            referencedColumnNames: ["id"],
            referencedTableName: "specialistProfiles",
            onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraint
        await queryRunner.dropForeignKey("certificates", "FK_specialistProfile_certificates");

        // Drop certificates table
        await queryRunner.dropTable("certificates");
    }
}
