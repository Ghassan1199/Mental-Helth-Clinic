import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";

export class CreateTransaction0000000000026 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: "transactions",
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
                type: "timestamp",
              },
              {
                name: "specialistWalletId",
                type: "int",
              },
              {
                name: "userWalletId",
                type: "int",
              },
              {
                name: "appointmentId",
                type: "int",
              },
            ],
          })
        );

        await queryRunner.createForeignKey("transactions", new TableForeignKey({
            columnNames: ["specialistWalletId"],
            referencedColumnNames: ["id"],
            referencedTableName: "wallets",
            onDelete: "CASCADE",
        }));

        await queryRunner.createForeignKey("transactions", new TableForeignKey({
            columnNames: ["userWalletId"],
            referencedColumnNames: ["id"],
            referencedTableName: "wallets",
            onDelete: "CASCADE",
        }));

        await queryRunner.createForeignKey("transactions", new TableForeignKey({
            columnNames: ["appointmentId"],
            referencedColumnNames: ["id"],
            referencedTableName: "appointments",
            onDelete: "CASCADE",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("transactions", "FK_specialistWalletId");
        await queryRunner.dropForeignKey("transactions", "FK_userWalletId");
        await queryRunner.dropForeignKey("transactions", "FK_appointmentId");
        await queryRunner.dropTable("transactions");
    }

}
