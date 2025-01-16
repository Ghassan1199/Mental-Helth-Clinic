import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";


export class CreateRegistrationRequest0000000000015 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create registrationRequests table
        await queryRunner.createTable(new Table({
            name: "registrationRequests",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "status",
                    type: "boolean",
                    isNullable: true,
                    default: null,
                },
                {
                    name: "description",
                    type: "text",
                    isNullable: true,
                    default: null,

                },
                {
                    name: "date",
                    type: "date",
                },
                {
                    name: "specialistId",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "adminId",
                    type: "int",
                    isNullable: true,
                },


                {
                    name: "clinicName",
                    type: "varchar",
                    length: "255",
                    isNullable: true,
                },
                {
                    name: "latitude",
                    type: "varchar",
                    isNullable: true,
                },
                {
                    name: "longitude",
                    type: "varchar",
                    isNullable: true,
                },

                {
                    name: "roleId",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "cityId",
                    type: "int",
                    isNullable: true,
                },

                {
                    name: "address",
                    type: "text",
                    length: "255",
                    isNullable: true,
                },
            ],
        }));

        // Add foreign key constraint for specialistId
        await queryRunner.createForeignKey("registrationRequests", new TableForeignKey({
            columnNames: ["specialistId"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
        }));

        // Add foreign key constraint for adminId
        await queryRunner.createForeignKey("registrationRequests", new TableForeignKey({
            columnNames: ["adminId"],
            referencedColumnNames: ["id"],
            referencedTableName: "admins",
            onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraints
        await queryRunner.dropForeignKey("registrationRequests", "FK_user_registrationRequests");
        await queryRunner.dropForeignKey("registrationRequests", "FK_admin_registrationRequests");

        // Drop registrationRequests table
        await queryRunner.dropTable("registrationRequests");
    }

}
