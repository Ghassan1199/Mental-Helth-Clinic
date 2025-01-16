import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";


export class CreateWithdrawSpecialistApprovement0000000000028 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "withdrawSpecialistApprovement",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "description",
                    type: "text",
                },
                {
                    name: "url",
                    type: "text",
                },
                {
                    name: "withdrawSpecialistTransactionId",
                    type: "int",
                    isNullable: true,
                },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("withdrawSpecialistApprovement");
    }

}
