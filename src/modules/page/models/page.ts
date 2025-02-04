import { model } from "@medusajs/framework/utils";
import type { InferSelectModel, InferInsertModel } from "@mikro-orm/core";

export const PageVersionTranslation = model.define(
  "page_version_translations",
  {
    id: model.id().primaryKey(),
    page_version: model.belongsTo(() => PageVersion, {
      inversedBy: "translations",
    }),
    language_code: model.text(),
    title: model.text(),
    content: model.json().nullable(),
    meta_title: model.text().nullable(),
    meta_description: model.text().nullable(),
    meta_keywords: model.text().nullable(),
    meta_robots: model.text().nullable(),
    canonical_url: model.text().nullable(),
    og_title: model.text().nullable(),
    og_description: model.text().nullable(),
    og_image: model.text().nullable(),
  }
);

export const PageVersion = model
  .define("page_versions", {
    id: model.id().primaryKey(),
    page: model.belongsTo(() => Pages, {
      inversedBy: "versions",
    }),
    version_number: model.float(),
    status: model.enum(["published", "draft"]),
    translations: model.hasMany(() => PageVersionTranslation, {
      mappedBy: "page_version",
    }),
  })
  .cascades({
    delete: ["translations"],
  });

export const Pages = model
  .define("pages", {
    id: model.id().primaryKey(),
    slug: model.text().unique().nullable(),
    versions: model.hasMany(() => PageVersion, {
      mappedBy: "page",
    }),
    published_version: model
      .belongsTo(() => PageVersion, {
        nullable: true,
      })
      .nullable(),
  })
  .cascades({
    delete: ["versions"],
  });

// Добавляем тип, сгенерированный по модели Pages
export type Page = InferSelectModel<typeof Pages>;
export type PageVersion = InferSelectModel<typeof PageVersion>;
export type PageVersionTranslation = InferSelectModel<
  typeof PageVersionTranslation
>;

export type PagesResponse = {
  pages: Page[];
  count: number;
  limit: number;
  offset: number;
};

export type PageUpdate = Partial<Page>;
