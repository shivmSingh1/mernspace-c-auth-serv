import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFkTenant1785482692642 implements MigrationInterface {
    name = 'AddFkTenant1785482692642';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "Tenants" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "address" character varying(255) NOT NULL, CONSTRAINT "PK_5273745c311d7f81450dbe5d9b9" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`ALTER TABLE "users" ADD "tenantId" integer`);
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "FK_c58f7e88c286e5e3478960a998b" FOREIGN KEY ("tenantId") REFERENCES "Tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" DROP CONSTRAINT "FK_c58f7e88c286e5e3478960a998b"`,
        );
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "tenantId"`);
        await queryRunner.query(`DROP TABLE "Tenants"`);
    }
}
