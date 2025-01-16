import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";

export class CreateCity0000000000011 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create cities table
        await queryRunner.createTable(
            new Table({
                name: "cities",
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
                        name: "eng",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                ],
            })
        );


    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        // Drop clinics table
        await queryRunner.dropTable("cities");
    }
}
