import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";


export class CreateAppointmentCancellation0000000000019 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create appointmentCancellations table
        await queryRunner.createTable(new Table({
            name: "appointmentCancellations",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "cancelledBy",
                    type: "boolean",
                },
                {
                    name: "date",
                    type: "date",
                },
                {
                    name: "description",
                    type: "text",
                },
                {
                    name: "appointmentId",
                    type: "int",
                    isNullable: false,
                },
            ],
        }));

        // Add foreign key constraint for appointmentId
        await queryRunner.createForeignKey("appointmentCancellations", new TableForeignKey({
            columnNames: ["appointmentId"],
            referencedColumnNames: ["id"],
            referencedTableName: "appointments",
            onDelete: "CASCADE", // or "SET NULL" or "RESTRICT"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraint
        await queryRunner.dropForeignKey("appointmentCancellations", "FK_appointment_appointmentCancellations");

        // Drop appointmentCancellations table
        await queryRunner.dropTable("appointmentCancellations");
    }

}
