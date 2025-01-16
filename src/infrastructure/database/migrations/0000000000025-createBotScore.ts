import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";


export class CreateBotScore00000000000025 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create botscore table
        await queryRunner.createTable(new Table({
            name: "botscores",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "score",
                    type: "varchar",
                },
                {
                    name: "userId",
                    type: "int",
                    isNullable: false,
                },
            ],
        }));

        // Add foreign key constraint for userId
        await queryRunner.createForeignKey("botscores", new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraint
        await queryRunner.dropForeignKey("botscores", "FK_user_botscores");

        // Drop userProfiles table
        await queryRunner.dropTable("botscores");
    }

}
