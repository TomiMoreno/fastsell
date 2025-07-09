"use client";

import { keepPreviousData } from "@tanstack/react-query";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  ChevronDown,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Edit,
  Loader2,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { type DateRange } from "react-day-picker";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { ProductImage } from "~/components/ui/product-image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

type Transaction = {
  id: string;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  productSales: Array<{
    id: string;
    price: number;
    amount: number;
    product: {
      id: string;
      name: string;
      image: string;
    };
  }>;
};

interface TransactionsTableProps {
  dateRange?: DateRange;
}

export function TransactionsTable({ dateRange }: TransactionsTableProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, refetch, isFetching } = api.sale.getTransactions.useQuery(
    {
      page,
      limit,
      dateRange: dateRange ?? {
        from: undefined,
        to: undefined,
      },
    },
    {
      placeholderData: keepPreviousData,
    },
  );

  const updateTransaction = api.sale.updateTransaction.useMutation({
    onSuccess: () => {
      toast({
        title: "Transacción actualizada",
        description: "Los cambios se han guardado correctamente",
      });
      void refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTransaction = api.sale.deleteTransaction.useMutation({
    onSuccess: () => {
      toast({
        title: "Transacción eliminada",
        description: "La transacción se ha eliminado correctamente",
      });
      void refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [editingRows, setEditingRows] = useState<Set<string>>(new Set());
  const [editData, setEditData] = useState<
    Record<string, Transaction["productSales"]>
  >({});

  const transactions = data?.sales ?? [];
  const pagination = data?.pagination;

  const toggleExpanded = (transactionId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(transactionId)) {
      newExpanded.delete(transactionId);
    } else {
      newExpanded.add(transactionId);
    }
    setExpandedRows(newExpanded);
  };

  const startEditing = (transaction: Transaction) => {
    setEditingRows((prev) => new Set(prev).add(transaction.id));
    setEditData((prev) => ({
      ...prev,
      [transaction.id]: transaction.productSales.map((ps) => ({ ...ps })),
    }));
  };

  const cancelEditing = (transactionId: string) => {
    setEditingRows((prev) => {
      const newSet = new Set(prev);
      newSet.delete(transactionId);
      return newSet;
    });
    setEditData((prev) => {
      const newData = { ...prev };
      delete newData[transactionId];
      return newData;
    });
  };

  const saveEditing = async (transaction: Transaction) => {
    const data = editData[transaction.id];
    if (!data) return;

    // Validar que todos los valores sean válidos
    const validData = data.filter((ps) => ps.amount > 0 && ps.price >= 0);
    if (validData.length === 0) {
      toast({
        title: "Error",
        description:
          "Debe haber al menos un producto con cantidad y precio válidos",
        variant: "destructive",
      });
      return;
    }

    await updateTransaction.mutateAsync({
      id: transaction.id,
      productSales: validData.map((ps) => ({
        id: ps.id,
        amount: ps.amount,
        price: ps.price,
      })),
    });

    setEditingRows((prev) => {
      const newSet = new Set(prev);
      newSet.delete(transaction.id);
      return newSet;
    });
    setEditData((prev) => {
      const newData = { ...prev };
      delete newData[transaction.id];
      return newData;
    });
  };

  const handleDelete = async (transactionId: string) => {
    if (
      confirm(
        "¿Estás seguro de que quieres eliminar esta transacción? Esta acción no se puede deshacer.",
      )
    ) {
      await deleteTransaction.mutateAsync({ id: transactionId });
    }
  };

  const updateProductSale = (
    transactionId: string,
    productSaleId: string,
    field: "amount" | "price",
    value: number,
  ) => {
    setEditData((prev) => ({
      ...prev,
      [transactionId]:
        prev[transactionId]?.map((ps) =>
          ps.id === productSaleId ? { ...ps, [field]: value } : ps,
        ) ?? [],
    }));
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setExpandedRows(new Set()); // Reset expanded rows when changing page
  };

  const handleLimitChange = (newLimit: string) => {
    const limitNum = parseInt(newLimit);
    setLimit(limitNum);
    setPage(1); // Reset to first page when changing limit
    setExpandedRows(new Set()); // Reset expanded rows
  };

  if (!data) {
    return <div>Cargando transacciones...</div>;
  }

  // Empty state when no transactions found
  if (transactions.length === 0) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <svg
                  className="h-8 w-8 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold">
                No hay transacciones
              </h3>
              <p className="text-muted-foreground">
                {dateRange?.from ?? dateRange?.to
                  ? "No se encontraron transacciones en el rango de fechas seleccionado."
                  : "No hay transacciones registradas aún."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isFetching && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="mr-2 size-5 animate-spin" />
          <span>Cargando transacciones...</span>
        </div>
      )}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead className="w-32">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => {
                const isExpanded = expandedRows.has(transaction.id);
                const isEditing = editingRows.has(transaction.id);
                const currentData =
                  editData[transaction.id] ?? transaction.productSales;

                return (
                  <>
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(transaction.id)}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        #{transaction.id.slice(-6).toUpperCase()}
                      </TableCell>
                      <TableCell>
                        {format(transaction.createdAt, "dd/MM/yyyy HH:mm", {
                          locale: es,
                        })}
                      </TableCell>
                      <TableCell className="font-medium">
                        ${transaction.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {transaction.productSales.length} productos
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {isEditing ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => saveEditing(transaction)}
                                disabled={updateTransaction.isPending}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => cancelEditing(transaction.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEditing(transaction)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(transaction.id)}
                                disabled={deleteTransaction.isPending}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>

                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={6} className="p-0">
                          <div className="bg-muted/50 p-4">
                            <h4 className="mb-3 font-medium">
                              Productos de la transacción
                            </h4>
                            <div className="space-y-2">
                              {currentData.map((productSale) => (
                                <div
                                  key={productSale.id}
                                  className="flex items-center justify-between rounded-lg border bg-background p-3"
                                >
                                  <div className="flex items-center gap-3">
                                    <ProductImage
                                      src={productSale.product.image}
                                      alt={productSale.product.name}
                                      size="md"
                                    />
                                    <div>
                                      <p className="font-medium">
                                        {productSale.product.name}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        ID: #{productSale.product.id.slice(-6)}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4">
                                    {isEditing ? (
                                      <>
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm">
                                            Cantidad:
                                          </span>
                                          <Input
                                            type="number"
                                            min="1"
                                            value={productSale.amount}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const numValue =
                                                value === ""
                                                  ? 0
                                                  : parseInt(value);
                                              updateProductSale(
                                                transaction.id,
                                                productSale.id,
                                                "amount",
                                                numValue,
                                              );
                                            }}
                                            className="w-20"
                                          />
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm">
                                            Precio:
                                          </span>
                                          <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={productSale.price}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              const numValue =
                                                value === ""
                                                  ? 0
                                                  : parseFloat(value);
                                              updateProductSale(
                                                transaction.id,
                                                productSale.id,
                                                "price",
                                                numValue,
                                              );
                                            }}
                                            className="w-24"
                                          />
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div className="text-center">
                                          <p className="text-sm text-muted-foreground">
                                            Cantidad
                                          </p>
                                          <p className="font-medium">
                                            {productSale.amount}
                                          </p>
                                        </div>
                                        <div className="text-center">
                                          <p className="text-sm text-muted-foreground">
                                            Precio
                                          </p>
                                          <p className="font-medium">
                                            ${productSale.price.toFixed(2)}
                                          </p>
                                        </div>
                                      </>
                                    )}

                                    <div className="text-center">
                                      <p className="text-sm text-muted-foreground">
                                        Subtotal
                                      </p>
                                      <p className="font-medium">
                                        $
                                        {(
                                          productSale.amount * productSale.price
                                        ).toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}

                              {isEditing && (
                                <div className="flex justify-end border-t pt-3">
                                  <div className="text-right">
                                    <p className="text-sm text-muted-foreground">
                                      Nuevo total
                                    </p>
                                    <p className="text-lg font-bold">
                                      $
                                      {currentData
                                        .reduce(
                                          (acc, ps) =>
                                            acc + ps.amount * ps.price,
                                          0,
                                        )
                                        .toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Paginación */}
      {pagination && pagination.totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Mostrar:</span>
                <Select
                  value={limit.toString()}
                  onValueChange={handleLimitChange}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">
                  por página
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Página {pagination.page} de {pagination.totalPages}(
                  {pagination.total} transacciones)
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.page === 1}
                >
                  <ChevronFirst className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Mostrar páginas cercanas */}
                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    const pageNum =
                      Math.max(
                        1,
                        Math.min(
                          pagination.totalPages - 4,
                          pagination.page - 2,
                        ),
                      ) + i;

                    if (pageNum > pagination.totalPages) return null;

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          pageNum === pagination.page ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-8"
                      >
                        {pageNum}
                      </Button>
                    );
                  },
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  <ChevronLast className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
