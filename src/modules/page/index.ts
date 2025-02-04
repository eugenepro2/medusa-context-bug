import { Module } from "@medusajs/framework/utils";
import PageModuleService from "./service";

export const PAGES_MODULE = "pages";

export default Module(PAGES_MODULE, {
  service: PageModuleService,
});
