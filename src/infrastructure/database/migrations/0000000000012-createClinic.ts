import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";

export class CreateClinic0000000000012 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create clinics table
        await queryRunner.createTable(
            new Table({
                name: "clinics",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "totalRate",
                        type: "float",
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
                        name: "doctorId",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "cityId",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "address",
                        type: "text",
                        isNullable: false,
                    },
                    // {
                    //     name: "isVerified",
                    //     type: "boolean",
                    //     default: false,
                    // },
    
                ],
            })
        );


    
        // Add foreign key constraint for specialistId
        await queryRunner.createForeignKey(
            "clinics",
            new TableForeignKey({
                columnNames: ["doctorId"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
            })
        );

            // Add foreign key constraint for cityId
            await queryRunner.createForeignKey(
                "clinics",
                new TableForeignKey({
                    columnNames: ["cityId"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "cities",
                    onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
                })
            );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraints
        await queryRunner.dropForeignKey("clinics", "FK_city_clinics");
        await queryRunner.dropForeignKey("clinics", "FK_user_clinics");

        // Drop clinics table
        await queryRunner.dropTable("clinics");
    }
}
