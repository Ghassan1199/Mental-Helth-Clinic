import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";


export class CreateEmployee0000000000024 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create employees table
        await queryRunner.createTable(new Table({
            name: "employees",
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
            ],
        }));

        // Add foreign key constraint for clinicId
        await queryRunner.createForeignKey("employees", new TableForeignKey({
            columnNames: ["clinicId"],
            referencedColumnNames: ["id"],
            referencedTableName: "clinics",
            onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
        }));

        // Add foreign key constraint for specialistId
        await queryRunner.createForeignKey("employees", new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraints
        await queryRunner.dropForeignKey("employees", "FK_clinic_employees");
        await queryRunner.dropForeignKey("employees", "FK_user_employees");

        // Drop employees table
        await queryRunner.dropTable("employees");
    }
}
