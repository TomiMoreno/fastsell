"use client";
import { type ColumnDef } from "@tanstack/react-table";
import UpdateProduct from "~/components/features/products/updateProduct";
import { DataTable } from "~/components/ui/dataTable";
import { Kbd } from "~/components/ui/kbd";
import { Switch } from "~/components/ui/switch";
import { formatCurrency } from "~/lib/utils";
import { api, type RouterOutputs } from "~/trpc/react";
import DeleteProduct from "./deleteProduct";

type Product = RouterOutputs["product"]["getAll"][0];

function ToggleEnabled({ product }: { product: Product }) {
  const utils = api.useUtils();
  const { mutate: toggleEnabled } = api.product.toggleEnabled.useMutation({
    onSuccess: () => {
      void utils.product.getAll.invalidate();
    },
  });

  return (
    <Switch
      checked={product.enabled}
      onCheckedChange={() => toggleEnabled(product.id)}
    />
  );
}

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "price",
    header: "Precio",
    cell: ({ row }) => formatCurrency(row.getValue("price")),
  },
  {
    header: "Hotkey",
    cell: ({ row }) => (
      <Kbd className="w-fit" disabled={!Boolean(row.original.hotkey)}>
        {row.original.hotkey ?? "_"}
      </Kbd>
    ),
  },
  {
    header: "Habilitado",
    cell: ({ row }) => <ToggleEnabled product={row.original} />,
  },
  {
    header: "Editar",
    cell: ({ row }) => (
      <UpdateProduct
        product={{
          ...row.original,
        }}
      />
    ),
  },
  {
    header: "Borrar",
    cell: ({ row }) => <DeleteProduct product={row.original} />,
  },
];

export default function ProductTable() {
  const { data, isLoading } = api.product.getAll.useQuery();
  return (
    <div className="container mx-auto py-10">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <DataTable columns={columns} data={data ?? []} />
      )}
    </div>
  );
}
