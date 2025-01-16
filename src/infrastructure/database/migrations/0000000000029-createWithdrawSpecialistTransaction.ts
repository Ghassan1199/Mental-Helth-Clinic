import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";


export class CreateWithdrawSpecialistTransaction0000000000029 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "withdrawSpecialistTransactions",
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
                    name: "withdrawSpecialistRequestId",
                    type: "int",
                },
                {
                    name: "withdrawSpecialistApprovementId",
                    type: "int",
                },
                {
                    name: "walletId",
                    type: "int",
                },
            ],
            foreignKeys: [
                {
                    columnNames: ["withdrawSpecialistRequestId"],
                    referencedTableName: "withdrawSpecialistRequests",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                    onUpdate: "CASCADE",
                },
                {
                    columnNames: ["withdrawSpecialistApprovementId"],
                    referencedTableName: "withdrawSpecialistApprovement",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                    onUpdate: "CASCADE",
                },
                {
                    columnNames: ["walletId"],
                    referencedTableName: "wallets",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                    onUpdate: "CASCADE",
                },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("withdrawSpecialistTransactions");
    }


}
