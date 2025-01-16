import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";


export class CreateRedeemTransaction0000000000004 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create redeemTransactions table
        await queryRunner.createTable(new Table({
            name: "redeemTransactions",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "amount",
                    type: "float",
                },
                {
                    name: "date",
                    type: "date",
                },
                {
                    name: "walletId",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "redeemCodeId",
                    type: "int",
                    isNullable: true,
                },
            ],
        }));

        // Add foreign key constraint for userWalletId
        await queryRunner.createForeignKey("redeemTransactions", new TableForeignKey({
            columnNames: ["walletId"],
            referencedColumnNames: ["id"],
            referencedTableName: "wallets",
            onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
        }));

        // Add foreign key constraint for redeemCodeId
        await queryRunner.createForeignKey("redeemTransactions", new TableForeignKey({
            columnNames: ["redeemCodeId"],
            referencedColumnNames: ["id"],
            referencedTableName: "redeemCodes",
            onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraints
        await queryRunner.dropForeignKey("redeemTransactions", "FK_wallet_redeemTransactions");
        await queryRunner.dropForeignKey("redeemTransactions", "FK_redeemCode_redeemTransactions");

        // Drop redeemTransactions table
        await queryRunner.dropTable("redeemTransactions");
    }

}
