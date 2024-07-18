"use client";
import { keepPreviousData } from "@tanstack/react-query";
import { DonutChart } from "@tremor/react";
import { DollarSign, ShoppingBag, ShoppingCart, Trophy } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { formatCurrency } from "~/lib/utils";
import { api } from "~/trpc/react";

const SalesDashboard = ({ dateRange }: { dateRange?: DateRange }) => {
  const { data, isLoading } = api.sale.dashboard.useQuery(
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

  if (isLoading) return <p>Cargando...</p>;
  if (!data) return <p>Error</p>;

  const {
    numberOfSales,
    totalSales,
    productsSold,
    mostSoldProduct,
    salesByProduct,
  } = data;

  return (
    <div className="grid w-full break-after-page gap-4 px-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ventas totales</CardTitle>
          <DollarSign />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
          <p className="text-xs text-muted-foreground">
            Total de ventas en caja
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ventas</CardTitle>
          <ShoppingBag />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{numberOfSales}</div>
          <p className="text-xs text-muted-foreground">Ventas en caja</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Productos vendidos
          </CardTitle>
          <ShoppingCart />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{productsSold}</div>
          <p className="text-xs text-muted-foreground">
            Cantidad de productos vendidos
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Producto más vendido
          </CardTitle>
          <Trophy />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {mostSoldProduct?.name ?? "Ninguno"}
          </div>
          <p className="text-xs text-muted-foreground">
            {mostSoldProduct?.amount ?? 0} ventas
          </p>
        </CardContent>
      </Card>
      <Card className="col-span-full print:hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Ventas por producto
          </CardTitle>
          <DollarSign />
        </CardHeader>
        <CardContent>
          <DonutChart
            className="mt-6"
            data={salesByProduct}
            category="totalPrice"
            index="name"
            valueFormatter={formatCurrency}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesDashboard;
