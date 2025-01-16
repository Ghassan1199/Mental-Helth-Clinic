import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";


export class CreateSpecialistCategory0000000000008 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "specialistCategories",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "specialistProfileId",
                    type: "int",
                },
                {
                    name: "categoryId",
                    type: "int",
                },
            ],
        }));

        await queryRunner.createForeignKey("specialistCategories", new TableForeignKey({
            columnNames: ["specialistProfileId"],
            referencedColumnNames: ["id"],
            referencedTableName: "specialistProfiles",
            onDelete: "CASCADE",
        }));

        await queryRunner.createForeignKey("specialistCategories", new TableForeignKey({
            columnNames: ["categoryId"],
            referencedColumnNames: ["id"],
            referencedTableName: "categories",
            onDelete: "CASCADE",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("specialistCategories", "FK_specialistProfileId");
        await queryRunner.dropForeignKey("specialistCategories", "FK_categoryId");
        await queryRunner.dropTable("specialistCategories");
    }

}
