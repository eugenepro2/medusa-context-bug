import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { PAGES_MODULE } from "../modules/page";
import PagesModuleService from "../modules/page/service";
import { Page } from "src/modules/page/models/page";

export type UpdatePageStepInput = Partial<Page>;

export const updatePageStep = createStep(
  "update-page-step",
  async (input: UpdatePageStepInput, { container }) => {
    const pageModuleService: PagesModuleService =
      container.resolve(PAGES_MODULE);

    const page = await pageModuleService.updatePages(input);

    return new StepResponse(page, page.id);
  }
);

export const updatePageWorkflow = createWorkflow(
  "update-page",
  (input: UpdatePageStepInput) => {
    const page = updatePageStep(input);

    return new WorkflowResponse(page);
  }
);
