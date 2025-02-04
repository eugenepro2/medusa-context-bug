import { Migration } from '@mikro-orm/migrations';

export class Migration20250204100455 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "pages" drop constraint if exists "pages_slug_unique";`);
    this.addSql(`create table if not exists "page_versions" ("id" text not null, "page_id" text not null, "version_number" integer not null, "status" text check ("status" in ('published', 'draft')) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "page_versions_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_page_versions_page_id" ON "page_versions" (page_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_page_versions_deleted_at" ON "page_versions" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "pages" ("id" text not null, "slug" text null, "published_version_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "pages_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_pages_slug_unique" ON "pages" (slug) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_pages_published_version_id" ON "pages" (published_version_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_pages_deleted_at" ON "pages" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "page_version_translations" ("id" text not null, "page_version_id" text not null, "language_code" text not null, "title" text not null, "content" jsonb null, "meta_title" text null, "meta_description" text null, "meta_keywords" text null, "meta_robots" text null, "canonical_url" text null, "og_title" text null, "og_description" text null, "og_image" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "page_version_translations_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_page_version_translations_page_version_id" ON "page_version_translations" (page_version_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_page_version_translations_deleted_at" ON "page_version_translations" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "page_versions" add constraint "page_versions_page_id_foreign" foreign key ("page_id") references "pages" ("id") on update cascade;`);

    this.addSql(`alter table if exists "pages" add constraint "pages_published_version_id_foreign" foreign key ("published_version_id") references "page_versions" ("id") on update cascade;`);

    this.addSql(`alter table if exists "page_version_translations" add constraint "page_version_translations_page_version_id_foreign" foreign key ("page_version_id") references "page_versions" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "pages" drop constraint if exists "pages_published_version_id_foreign";`);

    this.addSql(`alter table if exists "page_version_translations" drop constraint if exists "page_version_translations_page_version_id_foreign";`);

    this.addSql(`alter table if exists "page_versions" drop constraint if exists "page_versions_page_id_foreign";`);

    this.addSql(`drop table if exists "page_versions" cascade;`);

    this.addSql(`drop table if exists "pages" cascade;`);

    this.addSql(`drop table if exists "page_version_translations" cascade;`);
  }

}
