import { Button, FocusModal, Heading, Input, Label, Text } from "@medusajs/ui";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const CreatePageSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
});
import { useMutation } from "@tanstack/react-query";
import { sdk } from "../../../lib/sdk";

type Props = {
  refetchPages: () => void;
};

const CreatePage: FC<Props> = ({ refetchPages }) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm<
    z.infer<typeof CreatePageSchema>
  >({
    defaultValues: {
      title: "",
      slug: "",
    },
    resolver: zodResolver(CreatePageSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof CreatePageSchema>) => {
      return sdk.client.fetch(`/admin/pages`, {
        method: "POST",
        body: data,
      });
    },
  });

  const onSubmit = async (data: z.infer<typeof CreatePageSchema>) => {
    try {
      await mutation.mutateAsync(data);
      refetchPages();
      reset();
      setOpen(false);
    } catch (error) {
      //@ts-expect-error
      setError(error?.message);
    }
  };

  return (
    <FocusModal open={open} onOpenChange={setOpen}>
      <FocusModal.Trigger asChild>
        <Button variant="secondary" size="small">
          Create Page
        </Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FocusModal.Header>
          <Button onClick={handleSubmit(onSubmit)}>Save</Button>
        </FocusModal.Header>
        <FocusModal.Body className="flex flex-col items-center py-16">
          <div className="flex w-full max-w-lg flex-col gap-y-8">
            <div className="flex flex-col gap-y-1">
              <Heading>Create New Page</Heading>
              <Text className="text-ui-fg-subtle">
                Create and manage pages. You can create multiple pages to
                organize your website.
              </Text>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="key_name" className="text-ui-fg-subtle">
                Title
              </Label>
              <Input placeholder="My Page" {...register("title")} />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="key_name" className="text-ui-fg-subtle">
                Slug
              </Label>
              <Input placeholder="my-page" {...register("slug")} />
            </div>
            {error && <Text className="text-ui-fg-error">{error}</Text>}
          </div>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
};

export default CreatePage;
