import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export const GET = async (
  req: MedusaRequest<{ slug: string }>,
  res: MedusaResponse
) => {
  const query = req.scope.resolve("query");

  const { data: pages } = await query.graph({
    entity: "pages",
    filters: {
      // @ts-expect-error
      slug: req.params.slug,
    },
    fields: ["*", "versions.*", "versions.translations.*"],
  });

  res.json({ pages });
};
