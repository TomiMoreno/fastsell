import { DollarSign, ShoppingBag, ShoppingCart, Trophy } from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { formatCurrency } from "~/lib/utils";
import { api } from "~/utils/api";

const SalesDashboard: React.FC = () => {
  const { data, isLoading } = api.sale.dashboard.useQuery();

  if (isLoading) return <p>Cargando...</p>;
  if (!data) return <p>Error</p>;

  const { totalSales, totalSalesAmount, totalSold, mostSoldProduct } = data;

  return (
    <div className="grid w-full break-after-page gap-4 px-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ventas totales</CardTitle>
          <DollarSign />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalSalesAmount)}
          </div>
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
          <div className="text-2xl font-bold">{totalSales}</div>
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
          <div className="text-2xl font-bold">{totalSold}</div>
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
            {mostSoldProduct?.name || "Ninguno"}
          </div>
          <p className="text-xs text-muted-foreground">
            {mostSoldProduct?.amount || 0} ventas
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesDashboard;
