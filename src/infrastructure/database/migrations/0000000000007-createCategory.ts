import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";


export class CreateCategory0000000000007 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create categories table
        await queryRunner.createTable(new Table({
            name: "categories",
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
                },

                
                    {
                        name: "eng",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop categories table
        await queryRunner.dropTable("categories");
    }

}
