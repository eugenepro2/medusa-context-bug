import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { PageUpdate } from "src/modules/page/models/page";
import { deletePageWorkflow } from "src/workflows/delete-page";
import { updatePageWorkflow } from "src/workflows/update-page";

export const PATCH = async (
  req: MedusaRequest<{ id: string; body: PageUpdate }>,
  res: MedusaResponse
) => {
  const { result } = await updatePageWorkflow(req.scope).run({
    input: req.body,
  });

  res.json({ result });
};

export const DELETE = async (
  req: MedusaRequest<{ id: string }>,
  res: MedusaResponse
) => {
  const { result } = await deletePageWorkflow(req.scope).run({
    input: { id: req.params.id },
  });

  res.json({ result });
};
