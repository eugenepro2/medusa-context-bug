import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { PAGES_MODULE } from "../modules/page";
import PagesModuleService from "../modules/page/service";

export type CreatePageStepInput = {
  title: string;
  slug: string;
};

export const createPageStep = createStep(
  "create-page-step",
  async (input: CreatePageStepInput, { container }) => {
    const pageModuleService: PagesModuleService =
      container.resolve(PAGES_MODULE);

    const page = await pageModuleService.createPages({
      slug: input.slug,
    });
    const version = await pageModuleService.createPageVersions({
      title: input.title,
      status: "draft",
      version_number: 1.0,
      page_id: page.id,
    });
    await pageModuleService.createPageVersionTranslations({
      page_version_id: version.id,
      language_code: "en",
      title: input.title,
    });
    return new StepResponse(page, page.id);
  }
);

type CreatePageWorkflowInput = {
  title: string;
  slug: string;
};

export const createPageWorkflow = createWorkflow(
  "create-page",
  (input: CreatePageWorkflowInput) => {
    const page = createPageStep(input);

    return new WorkflowResponse(page);
  }
);
