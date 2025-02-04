import {
  defineMiddlewares,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework/http";
import { PostAdminCreatePage } from "./admin/pages/validators";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";

export const GetPagesSchema = createFindParams();

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/pages",
      method: "POST",
      middlewares: [validateAndTransformBody(PostAdminCreatePage)],
    },
    {
      matcher: "/admin/pages",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(GetPagesSchema, {
          defaults: ["id", "slug"],
          isList: true,
        }),
      ],
    },
    {
      matcher: "/admin/pages/:id",
      method: "DELETE",
      middlewares: [],
    },
  ],
});
