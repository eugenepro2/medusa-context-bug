import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { createPageWorkflow } from "../../../workflows/create-page";
import { PostAdminCreatePage } from "./validators";
import { z } from "zod";
import { QueryContext } from "@medusajs/framework/utils";

type PostAdminCreatePageType = z.infer<typeof PostAdminCreatePage>;

export const POST = async (
  req: MedusaRequest<PostAdminCreatePageType>,
  res: MedusaResponse
) => {
  const { result } = await createPageWorkflow(req.scope).run({
    input: req.validatedBody,
  });

  res.json({ page: result });
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query");
  console.log(req.validatedQuery, "req.query");
  console.log(req.queryConfig, "req.queryConfig");
  const {
    data: pages,
    metadata: { count, take, skip },
  } = await query.graph({
    entity: "pages",
    fields: ["*"],
    pagination: {
      skip: 0,
      take: 10,
    },
    context: QueryContext({
      slug: "test",
    }),
  });

  res.json({
    pages,
    count,
    limit: take,
    offset: skip,
  });
};
