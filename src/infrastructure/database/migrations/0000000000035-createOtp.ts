import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";

export class CreateOtp0000000000035 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "otps",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "userId",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "token",
                        type: "int",
                        isNullable: false,
                        isUnique: true
                    },
                    {
                        name: "expiredAt",
                        type: "timestamp",
                    },

                    {
                        name: "verified",
                        type: "boolean",
                        default: false,
                    },
                ],
            })
        );

        await queryRunner.createForeignKey(
            "otps",
            new TableForeignKey({
                columnNames: ["userId"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
            })
        );
    }
 
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("otps", "FK_user_otps");

        await queryRunner.dropTable("otps");
    }
}
