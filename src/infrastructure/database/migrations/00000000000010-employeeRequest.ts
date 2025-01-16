import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";


export class CreateEmployeeRequest0000000000024 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create employeeRequests table
        await queryRunner.createTable(new Table({
            name: "employeeRequests",
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
                    name: "clinicId",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "userId",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "status",
                    type: "boolean",
                    isNullable: true,
                    default: null,
                },
            ],
        }));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        // Drop employees table
        await queryRunner.dropTable("employeeRequests");
    }
}
