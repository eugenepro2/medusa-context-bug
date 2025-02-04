import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { PAGES_MODULE } from "../modules/page";
import PagesModuleService from "../modules/page/service";

export type DeletePageStepInput = {
  id: string;
};

export const deletePageStep = createStep(
  "delete-page-step",
  async (input: DeletePageStepInput, { container }) => {
    const pageModuleService: PagesModuleService =
      container.resolve(PAGES_MODULE);

    const result = await pageModuleService.deletePages(input.id);

    return new StepResponse(result, input.id);
  }
);

type DeletePageWorkflowInput = {
  id: string;
};

export const deletePageWorkflow = createWorkflow(
  "delete-page",
  (input: DeletePageWorkflowInput) => {
    const deletionStep = deletePageStep(input);

    return new WorkflowResponse(deletionStep);
  }
);
