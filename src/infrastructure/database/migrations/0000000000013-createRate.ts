import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";


export class CreateRate0000000000013 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create rates table
        await queryRunner.createTable(new Table({
            name: "rates",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "value",
                    type: "float",
                },
                {
                    name: "userId",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "clinicId",
                    type: "int",
                    isNullable: true,
                },
            ],
        }));

        // Add foreign key constraint for userId
        await queryRunner.createForeignKey("rates", new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
        }));

        // Add foreign key constraint for clinicId
        await queryRunner.createForeignKey("rates", new TableForeignKey({
            columnNames: ["clinicId"],
            referencedColumnNames: ["id"],
            referencedTableName: "clinics",
            onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraints
        await queryRunner.dropForeignKey("rates", "FK_user_rates");
        await queryRunner.dropForeignKey("rates", "FK_clinic_rates");

        // Drop rates table
        await queryRunner.dropTable("rates");
    }

}
