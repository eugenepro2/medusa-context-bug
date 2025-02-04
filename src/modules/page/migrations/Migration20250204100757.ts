import { Migration } from '@mikro-orm/migrations';

export class Migration20250204100757 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "pages" drop constraint if exists "pages_published_version_id_foreign";`);

    this.addSql(`alter table if exists "pages" alter column "published_version_id" type text using ("published_version_id"::text);`);
    this.addSql(`alter table if exists "pages" alter column "published_version_id" drop not null;`);
    this.addSql(`alter table if exists "pages" add constraint "pages_published_version_id_foreign" foreign key ("published_version_id") references "page_versions" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "pages" drop constraint if exists "pages_published_version_id_foreign";`);

    this.addSql(`alter table if exists "pages" alter column "published_version_id" type text using ("published_version_id"::text);`);
    this.addSql(`alter table if exists "pages" alter column "published_version_id" set not null;`);
    this.addSql(`alter table if exists "pages" add constraint "pages_published_version_id_foreign" foreign key ("published_version_id") references "page_versions" ("id") on update cascade;`);
  }

}
