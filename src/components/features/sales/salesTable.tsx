"use client";
import { keepPreviousData } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/dataTable";
import { formatCurrency } from "~/lib/utils";
import { type RouterOutputs, api } from "~/trpc/react";

type Product = RouterOutputs["sale"]["dashboard"]["salesByProduct"][number];

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="ml-[-0.5rem] px-[0.5rem]"
        >
          Cantidad
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="ml-[-0.5rem] px-[0.5rem]"
        >
          Precio
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => formatCurrency(row.original.price ?? 0),
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="ml-[-0.5rem] px-[0.5rem]"
        >
          Total
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => formatCurrency(row.original.totalPrice),
    sortingFn: (a, b) => a.original.totalPrice - b.original.totalPrice,
  },
];

export default function SalesTable({
  dateRange,
}: {
  dateRange: DateRange | undefined;
}) {
  const { data: { salesByProduct: data } = {}, isLoading } =
    api.sale.dashboard.useQuery(
      {
        dateRange: dateRange ?? {
          from: undefined,
          to: undefined,
        },
      },
      {
        placeholderData: keepPreviousData,
      },
    );
  return (
    <div className="container mx-auto flex flex-col gap-5 py-10">
      <div className="flex flex-row items-center justify-between">
        <h3 className="text-3xl font-bold">Ventas por producto</h3>
        <Button className="px-4 print:hidden" onClick={() => window.print()}>
          Imprimir
        </Button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <DataTable columns={columns} data={data ?? []} />
      )}
    </div>
  );
}
