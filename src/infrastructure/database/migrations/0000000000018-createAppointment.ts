import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";


export class CreateAppointment0000000000018 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create appointments table
        await queryRunner.createTable(
          new Table({
            name: "appointments",
            columns: [
              {
                name: "id",
                type: "int",
                isPrimary: true,
                isGenerated: true,
                generationStrategy: "increment",
              },
              {
                name: "date",
                type: "timestamp",
              },
              {
                name: "specialistId",
                type: "int",
                isNullable: false,
              },
              {
                name: "isCancelled",
                type: "boolean",
                default: false,
              },
              {
                name: "isCompleted",
                type: "boolean",
                default: false,
              },
              {
                name: "isNotified",
                type: "boolean",
                default: false,
              },
              { 
                name: "completedByUser",
                type: "boolean",
                default: false,
              },
              {
                name: "completedBySpec",
                type: "boolean",
                default: false,
              },
              {
                name: "userId",
                type: "int",
                isNullable: false,
              },
              {
                name: "price",
                type: "varchar",
                isNullable: false,
              },
            ],
          })
        );

        // Add foreign key constraints
        await queryRunner.createForeignKey(
          "appointments",
          new TableForeignKey({
            columnNames: ["specialistId"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
          })
        );

        await queryRunner.createForeignKey("appointments", new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
        }));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraints
        await queryRunner.dropForeignKey(
          "appointments",
          "FK_specialist_appointments"
        );
        await queryRunner.dropForeignKey("appointments", "FK_user_appointments");
        
        // Drop appointments table
        await queryRunner.dropTable("appointments");
    }

}
