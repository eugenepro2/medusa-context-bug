import { PencilSquare, Trash } from "@medusajs/icons";
import { usePrompt } from "@medusajs/ui";
import { Row } from "@tanstack/react-table";
import { sdk } from "../../../lib/sdk";
import { useMutation } from "@tanstack/react-query";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ActionMenu } from "../../../components/action-menu";
import { Page } from "../../../../modules/page/models/page";
type Props = {
  row: Row<Page>;
  refetchPages: () => void;
};

const Actions: FC<Props> = ({ row, refetchPages }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const prompt = usePrompt();
  const mutation = useMutation({
    mutationFn: (id: string) => {
      return sdk.client.fetch(`/admin/pages/${id}`, {
        method: "DELETE",
      });
    },
  });

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("Are you sure you want to delete this page?"),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    });

    if (!res) {
      return;
    }
    await mutation.mutateAsync(row.original.id);
    refetchPages();
  };

  return (
    <div className="float-right">
      <ActionMenu
        groups={[
          {
            actions: [
              {
                icon: <PencilSquare />,
                label: "Edit",
                onClick: () => {
                  navigate(`/pages/${row.original.slug}`);
                },
              },
              {
                icon: <Trash />,
                label: "Delete",
                onClick: handleDelete,
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default Actions;
