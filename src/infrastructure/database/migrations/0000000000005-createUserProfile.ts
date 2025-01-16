import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";


export class CreateUserProfile0000000000005 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create profiles table
        await queryRunner.createTable(new Table({
            name: "userProfiles",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
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
                    name: "fullName",
                    type: "varchar",
                    length: "100",
                },
                {
                    name: "maritalStatus",
                    type: "enum",
                    enum: ["Single", "Married", "Divorced", "Widowed"],
                },
                {
                    name: "children",
                    type: "int",
                    default: 0,
                },
                {
                    name: "profession",
                    type: "varchar",
                    length: "100",
                },
                {
                    name: "placeOfWork",
                    type: "varchar",
                    length: "100",
                },
                {
                    name: "hoursOfWork",
                    type: "int",
                },


                {
                    name: "userId",
                    type: "int",
                    isNullable: false,
                },
            ],
        }));

        // Add foreign key constraint for userId
        await queryRunner.createForeignKey("userProfiles", new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraint
        await queryRunner.dropForeignKey("userProfiles", "FK_user_userProfiles");

        // Drop userProfiles table
        await queryRunner.dropTable("userProfiles");
    }

}
