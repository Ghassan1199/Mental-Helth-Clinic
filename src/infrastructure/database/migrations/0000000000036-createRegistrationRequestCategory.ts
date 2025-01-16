import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";


export class CreateRegistrationRequestCategory0000000000036 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create registrationRequestCategories table
        await queryRunner.createTable(new Table({
            name: "registrationRequestCategories",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "categoryId",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "registrationRequestId",
                    type: "int",
                    isNullable: false,
                },
            ],
        }));

        // Add foreign key constraint for registrationRequestId
        await queryRunner.createForeignKey("registrationRequestCategories", new TableForeignKey({
            columnNames: ["registrationRequestId"],
            referencedColumnNames: ["id"],
            referencedTableName: "registrationRequests",
            onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
        }));

        await queryRunner.createForeignKey("registrationRequestCategories", new TableForeignKey({
            columnNames: ["categoryId"],
            referencedColumnNames: ["id"],
            referencedTableName: "categories",
            onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraint
        await queryRunner.dropForeignKey("registrationRequestCategories", "FK_category_registrationRequestCategories");
        await queryRunner.dropForeignKey("registrationRequestCategories", "FK_registrationRequest_registrationRequestCategories");

        // Drop registrationRequestCategories table
        await queryRunner.dropTable("registrationRequestCategories");

    }

}
