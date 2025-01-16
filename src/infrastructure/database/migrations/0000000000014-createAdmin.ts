import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";

export class CreateAdmin0000000000014 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create admins table
        await queryRunner.createTable(
            new Table({
                name: "admins",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "fullName",
                        type: "varchar",
                        length: "100",
                    },
                    {
                        name: "username",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: "password",
                        type: "text",
                        isNullable: false,
                    },
                    {
                        name: "isSuper",
                        type: "boolean",
                        default: false,
                    },
                ],
            })
        );
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key columns
        await queryRunner.dropTable("admins");
    }
}
