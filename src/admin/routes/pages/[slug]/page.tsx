import { useParams } from "react-router-dom";
import { Button, Container, Heading } from "@medusajs/ui";
import { Puck, usePuck } from "@measured/puck";
import "@measured/puck/puck.css";
import { sdk } from "../../../lib/sdk";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PagesResponse } from "../../../../modules/page/models/page";
import { SectionRow } from "../../../components/section-row";
import EditMetafields from "./components/edit-metafields";
import EditMainfields from "./components/edit-mainfields";
import { z } from "zod";

const EditContentSchema = z.object({
  content: z.string(),
});

const config = {
  components: {
    HeadingBlock: {
      fields: {
        children: {
          type: "text",
        },
      },
      render: ({ children }: { children: string }) => {
        return <h1>{children}</h1>;
      },
    },
  },
};

const Page = () => {
  const { slug } = useParams();

  const {
    data,
    isLoading,
    refetch: refetchPage,
  } = useQuery<PagesResponse>({
    queryFn: () => sdk.client.fetch(`/admin/pages/${slug}`),
    queryKey: [["pages", slug]],
  });

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof EditContentSchema>) => {
      return sdk.client.fetch(`/admin/pages/${page?.id}`, {
        method: "PATCH",
        body: {
          id: page?.id,
          ...data,
        },
      });
    },
  });

  const page = data?.pages[0];

  // Save the data to your database
  const save = async (data: any) => {
    await mutation.mutateAsync({ content: data });
    refetchPage();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h1">Page: {page?.title}</Heading>
          <div className="flex gap-2">
            <EditMainfields page={page} refetch={refetchPage} />
            <Button variant="secondary" size="small">
              Delete
            </Button>
          </div>
        </div>
        <SectionRow title="Slug" value={slug} />
      </Container>
      <Container>
        <Puck
          overrides={{
            headerActions: () => {
              const { appState } = usePuck();
              return (
                <>
                  <Button variant="secondary" onClick={() => save(appState)}>
                    Save
                  </Button>
                </>
              );
            },
          }}
          config={config}
          data={page?.content?.data}
          onSave={save}
        />
      </Container>
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">Meta Fields</Heading>
          <div className="flex gap-2">
            <EditMetafields page={page} refetch={refetchPage} />
          </div>
        </div>
        <SectionRow title="Meta Title" value={page?.meta_title} />
        <SectionRow title="Meta Description" value={page?.meta_description} />
        <SectionRow title="Meta Keywords" value={page?.meta_keywords} />
        <SectionRow title="Meta Robots" value={page?.meta_robots} />
        <SectionRow title="Canonical URL" value={page?.canonical_url} />
        <SectionRow title="OG Title" value={page?.og_title} />
        <SectionRow title="OG Description" value={page?.og_description} />
        <SectionRow title="OG Image" value={page?.og_image} />
      </Container>
    </>
  );
};

export default Page;
