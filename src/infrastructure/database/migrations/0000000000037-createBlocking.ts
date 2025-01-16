import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";


export class CreateBlocjing00000000000025 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create blocking table
        await queryRunner.createTable(new Table({
            name: "blockings",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "doctorId",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "userId",
                    type: "int",
                    isNullable: false,
                },
                {
                       name: "blockedBy",
                    type: "boolean",
                    isNullable: false,
                },
                {
                    name: "date",
                    type: "timestamp",
                    default: "now()",
                },
            ],
        }));

        // Add foreign key constraint for userId
        await queryRunner.createForeignKey("blockings", new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
        }));


         // Add foreign key constraint for doctorId
         await queryRunner.createForeignKey("blockings", new TableForeignKey({
            columnNames: ["doctorId"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraint
                                await queryRunner.dropForeignKey("blockings", "FK_user_blockings");

        // Drop userProfiles table
        await queryRunner.dropTable("blockings");
    }

}
