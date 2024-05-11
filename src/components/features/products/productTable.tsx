"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/components/ui/dataTable";
import UpdateProduct from "~/components/features/products/updateProduct";
import { formatCurrency } from "~/lib/utils";
import { Kbd } from "~/components/ui/kbd";
import DeleteProduct from "./deleteProduct";
import { api, type RouterOutputs } from "~/trpc/react";

type Product = RouterOutputs["product"]["getAll"][0];

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
