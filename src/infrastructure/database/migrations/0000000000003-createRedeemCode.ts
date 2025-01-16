import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";


export class CreateRedeemCode0000000000003    implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create redeemCodes table
        await queryRunner.createTable(new Table({
            name: "redeemCodes",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "code",
                    type: "varchar",
                    length: "255",
                },
                {
                    name: "amount",
                    type: "float",
                },
                {
                    name: "isUsed",
                    type: "boolean",
                    default: false,
                },
            ],
        }));

       
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraint

        // Drop redeemCodes table
        await queryRunner.dropTable("redeemCodes");
    }
}
