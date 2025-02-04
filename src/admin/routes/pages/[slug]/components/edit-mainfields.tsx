import { Button, Drawer, Input, Label } from "@medusajs/ui";
import { FC, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Page } from "../../../../../modules/page/models/page";
import { sdk } from "../../../../lib/sdk";
import { useMutation } from "@tanstack/react-query";

const EditMetafieldsSchema = z.object({
  title: z.string(),
  slug: z.string(),
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
      title: page?.title ?? "",
      slug: page?.slug ?? "",
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
        <Button variant="secondary">Edit</Button>
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
            <Input id="title" placeholder="Title" {...register("title")} />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="meta_description" className="text-ui-fg-subtle">
              Meta Description
            </Label>
            <Input
              id="meta_description"
              placeholder="Slug"
              {...register("slug")}
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
