import { Button, Drawer, Input, Label } from "@medusajs/ui";
import { FC, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Page } from "../../../../../modules/page/models/page";
import { sdk } from "../../../../lib/sdk";
import { useMutation } from "@tanstack/react-query";

const EditMetafieldsSchema = z.object({
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
  meta_robots: z.string().optional(),
  canonical_url: z.string().optional(),
  og_title: z.string().optional(),
  og_description: z.string().optional(),
  og_image: z.string().optional(),
});

type Props = {
  page?: Page;
  refetch: () => void;
};
const EditMetafields: FC<Props> = ({ page, refetch }) => {
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof EditMetafieldsSchema>) => {
      return sdk.client.fetch(`/admin/pages/${page?.id}`, {
        method: "PATCH",
        body: {
          id: page?.id,
          ...data,
        },
      });
    },
  });

  const { register, handleSubmit } = useForm<
    z.infer<typeof EditMetafieldsSchema>
  >({
    defaultValues: {
      meta_title: page?.meta_title ?? "",
      meta_description: page?.meta_description ?? "",
      meta_keywords: page?.meta_keywords ?? "",
      meta_robots: page?.meta_robots ?? "",
      canonical_url: page?.canonical_url ?? "",
      og_title: page?.og_title ?? "",
      og_description: page?.og_description ?? "",
      og_image: page?.og_image ?? "",
    },
    resolver: zodResolver(EditMetafieldsSchema),
  });

  const onSubmit = async (data: z.infer<typeof EditMetafieldsSchema>) => {
    await mutation.mutateAsync(data);
    setOpen(false);
    refetch();
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <Drawer.Trigger>
        <Button variant="secondary">Edit Metafields</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Edit Metafields</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="flex flex-1 flex-col gap-y-8 overflow-y-auto">
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="meta_title" className="text-ui-fg-subtle">
              Meta Title
            </Label>
            <Input
              id="meta_title"
              placeholder="Meta Title"
              {...register("meta_title")}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="meta_description" className="text-ui-fg-subtle">
              Meta Description
            </Label>
            <Input
              id="meta_description"
              placeholder="Meta Description"
              {...register("meta_description")}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="meta_keywords" className="text-ui-fg-subtle">
              Meta Keywords
            </Label>
            <Input
              id="meta_keywords"
              placeholder="Meta Keywords"
              {...register("meta_keywords")}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="meta_robots" className="text-ui-fg-subtle">
              Meta Robots
            </Label>
            <Input
              id="meta_robots"
              placeholder="Meta Robots"
              {...register("meta_robots")}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="canonical_url" className="text-ui-fg-subtle">
              Canonical URL
            </Label>
            <Input
              id="canonical_url"
              placeholder="Canonical URL"
              {...register("canonical_url")}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="og_title" className="text-ui-fg-subtle">
              OG Title
            </Label>
            <Input
              id="og_title"
              placeholder="OG Title"
              {...register("og_title")}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="og_description" className="text-ui-fg-subtle">
              OG Description
            </Label>
            <Input
              id="og_description"
              placeholder="OG Description"
              {...register("og_description")}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="og_image" className="text-ui-fg-subtle">
              OG Image
            </Label>
            <Input
              id="og_image"
              placeholder="OG Image"
              {...register("og_image")}
            />
          </div>
        </Drawer.Body>
        <Drawer.Footer>
          <Button variant="secondary" onClick={handleSubmit(onSubmit)}>
            Save
          </Button>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
};

export default EditMetafields;
