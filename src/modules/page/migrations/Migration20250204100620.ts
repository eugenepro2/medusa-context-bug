import { Migration } from '@mikro-orm/migrations';

export class Migration20250204100620 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "page_versions" alter column "version_number" type real using ("version_number"::real);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "page_versions" alter column "version_number" type integer using ("version_number"::integer);`);
  }

}
