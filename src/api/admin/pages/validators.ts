import { z } from "zod";

export const PostAdminCreatePage = z.object({
  title: z.string(),
  slug: z.string().nullable(),
});
