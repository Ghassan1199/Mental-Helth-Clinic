import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";


export class CreateRegistrationRequestContent0000000000016 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create registrationRequestContents table
        await queryRunner.createTable(new Table({
            name: "registrationRequestContents",
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
                    name: "registrationRequestId",
                    type: "int",
                    isNullable: false,
                },
            ],
        }));

        // Add foreign key constraint for registrationRequestId
        await queryRunner.createForeignKey("registrationRequestContents", new TableForeignKey({
            columnNames: ["registrationRequestId"],
            referencedColumnNames: ["id"],
            referencedTableName: "registrationRequests",
            onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraint
        await queryRunner.dropForeignKey("registrationRequestContents", "FK_registrationRequest_registrationRequestContents");

        // Drop registrationRequestContents table
        await queryRunner.dropTable("registrationRequestContents");
    }

}
