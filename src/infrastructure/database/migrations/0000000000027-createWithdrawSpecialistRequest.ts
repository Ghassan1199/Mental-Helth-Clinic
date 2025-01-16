import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";


export class CreateWithdrawSpecialistRequest0000000000027 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "withdrawSpecialistRequests",
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
                    name: "status",
                    type: "boolean",
                    isNullable: true,
                    default: null,
                },
                {
                    name: "date",
                    type: "date",
                },
                {
                    name: "specialistId",
                    type: "int",
                },
                {
                    name: "adminId",
                    type: "int",
                    isNullable: true,

                },

                {
                    name: "balance",
                    type: "float",
                    isNullable: true,

                },
            ],
            foreignKeys: [
                {
                    columnNames: ["specialistId"],
                    referencedTableName: "users",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                    onUpdate: "CASCADE",
                },
                {
                    columnNames: ["adminId"],
                    referencedTableName: "admins",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                    onUpdate: "CASCADE",
                },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("withdrawSpecialistRequests");
    }

}
