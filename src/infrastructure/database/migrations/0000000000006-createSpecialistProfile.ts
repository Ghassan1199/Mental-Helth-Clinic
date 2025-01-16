import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";

export class CreateSpecialistProfile0000000000006
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "specialistProfiles",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "fullName",
                        type: "varchar",
                        length: "100",
                    },

                    {
                        name: "dateOfBirth",
                        type: "date",
                    },
                    {
                        name: "gender",
                        type: "boolean",
                    },
                    {
                        name: "photo",
                        type: "text",
                    },
                    {
                        name: "phone",
                        type: "int",
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: "status",
                        type: "varchar",
                        length: "20",
                        default: "'unverified'",
                    },
                    {
                        name: "userId",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "studyInfo",
                        type: "text",
                        isNullable: true,
                        default: null

                    },
                    {
                        name: "specInfo",
                        type: "text",
                        isNullable: true,
                        default: null

                    },
                ],
            })

        
        );

        await queryRunner.createForeignKey(
            "specialistProfiles",
            new TableForeignKey({
                columnNames: ["userId"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(
            "specialistProfiles",
            "FK_user_specialistProfiles"
        );

        await queryRunner.dropTable("specialistProfiles");
    }
}
