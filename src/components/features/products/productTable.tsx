import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/components/ui/dataTable";
import UpdateProduct from "~/components/features/products/updateProduct";
import { formatCurrency } from "~/lib/utils";
import { type RouterOutputs, api } from "~/utils/api";
import { Kbd } from "~/components/ui/kbd";

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
        {row.original.hotkey ?? "𝕏"}
      </Kbd>
    ),
  },
  {
    header: "Edit",
    cell: ({ row }) => (
      <UpdateProduct
        product={{
          ...row.original,
        }}
      />
    ),
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
