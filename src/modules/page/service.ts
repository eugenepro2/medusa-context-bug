import { MedusaContext, MedusaService } from "@medusajs/framework/utils";

import { Context, FindConfig } from "@medusajs/framework/types";
import { Pages, PageVersion, PageVersionTranslation } from "./models/page";

class PagesModuleService extends MedusaService({
  Pages,
  PageVersion,
  PageVersionTranslation,
}) {
  // @ts-ignore
  async listPages(
    filters?: any,
    config?: FindConfig<any> | undefined,
    @MedusaContext() sharedContext?: Context | undefined
  ) {
    const context = filters.context ?? {};
    delete filters.context;

    let pages = await super.listPages(filters, config, sharedContext);

    console.log(context, "context");

    return pages;
  }
}

export default PagesModuleService;
