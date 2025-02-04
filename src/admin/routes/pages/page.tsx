import {
  createDataTableColumnHelper,
  useDataTable,
  DataTable,
  Heading,
  Container,
  DataTablePaginationState,
  Badge,
} from "@medusajs/ui";
import { useMemo, useState } from "react";
import { ChatBubbleLeftRight } from "@medusajs/icons";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import { sdk } from "../../lib/sdk";
import { useQuery } from "@tanstack/react-query";
import CreatePage from "./components/CreatePage";
import Actions from "./components/Actions";
import { Page, PagesResponse } from "../../../modules/page/models/page";

const columnHelper = createDataTableColumnHelper<Page>();

const Pages = () => {
  const limit = 15;
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: limit,
    pageIndex: 0,
  });
  const offset = useMemo(() => {
    return pagination.pageIndex * limit;
  }, [pagination]);

  const {
    data,
    isLoading,
    refetch: refetchPages,
  } = useQuery<PagesResponse>({
    queryFn: () =>
      sdk.client.fetch(`/admin/pages`, {
        query: {
          limit,
          offset,
          fields: "versions.*, versions.translations.*",
        },
      }),
    queryKey: [["pages", limit, offset]],
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor("versions.0.translations.0.title", {
        header: "Title",
      }),
      columnHelper.accessor("slug", {
        header: "Slug",
      }),
      columnHelper.accessor("is_published", {
        header: "Published",
        cell: ({ row }) => {
          return (
            <Badge color={row.original.is_published ? "green" : "grey"}>
              {row.original.is_published ? "Yes" : "No"}
            </Badge>
          );
        },
      }),
      columnHelper.accessor("is_draft", {
        header: "Draft",
        cell: ({ row }) => {
          return (
            <Badge color={row.original.is_draft ? "green" : "grey"}>
              {row.original.is_draft ? "Yes" : "No"}
            </Badge>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return <Actions refetchPages={refetchPages} row={row} />;
        },
      }),
    ],
    [refetchPages]
  );

  const table = useDataTable({
    columns,
    data: data?.pages ?? [],
    getRowId: (page) => page.id,
    rowCount: data?.count ?? 0,
    isLoading: isLoading,
  });
  console.log(data, "data");

  return (
    <Container className="p-0">
      <DataTable instance={table}>
        <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <Heading>Pages</Heading>
          <CreatePage refetchPages={refetchPages} />
        </DataTable.Toolbar>
        <DataTable.Table
          emptyState={{
            empty: {
              heading: "No pages found",
              description: "Create a new page to get started",
            },
          }}
        />
      </DataTable>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Pages",
  icon: ChatBubbleLeftRight,
});

export default Pages;
