"use client";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { type ChangeEvent } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { useToast } from "~/components/ui/use-toast";
import { type Product } from "~/lib/schemas/product";
import { useCart } from "~/lib/store";
import { api } from "~/trpc/react";

interface EditableReceiptProps {
  items: { product: Product; amount: number }[];
  total: number;
}

export default function EditableReceipt({
  items,
  total,
}: EditableReceiptProps) {
  const { changeAmount, removeFromCart, reset } = useCart();
  const { toast } = useToast();
  const utils = api.useUtils();

  const { mutateAsync, isPending } = api.sale.create.useMutation({
    onSuccess: () => {
      void utils.product.getAll.invalidate();
      reset();
      toast({
        title: "Compra realizada",
        description: "La transacción se ha completado exitosamente.",
      });
    },
  });

  const handleQuantityChange = (
    product: Product,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = Math.max(parseInt(e.target.value) || 0, 0);
    changeAmount(product, value);
  };

  const handleIncrement = (product: Product) => {
    const currentAmount =
      items.find((item) => item.product.id === product.id)?.amount ?? 0;
    changeAmount(product, currentAmount + 1);
  };

  const handleDecrement = (product: Product) => {
    const currentAmount =
      items.find((item) => item.product.id === product.id)?.amount ?? 0;
    if (currentAmount > 0) {
      changeAmount(product, currentAmount - 1);
    }
  };

  const handleRemove = (product: Product) => {
    removeFromCart(product);
  };

  const handlePurchase = async () => {
    if (items.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos antes de realizar la compra.",
        variant: "destructive",
      });
      return;
    }

    try {
      await mutateAsync({
        productMap: new Map(items.map((item) => [item.product.id, item])),
      });
    } catch (error) {
      toast({
        title: "Error al procesar la compra",
        description: "Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center">
        <div className="text-muted-foreground">
          <ShoppingCart className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p className="text-lg font-medium">Carrito vacío</p>
          <p className="text-sm">Agrega productos para ver el recibo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Productos en el carrito</h3>
          <Badge
            variant="secondary"
            className="flex items-center justify-center"
          >
            {items.length}
          </Badge>
        </div>

        <div className="max-h-96 space-y-3 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex min-h-[5rem] flex-row gap-3 rounded-lg border bg-card p-3 shadow-sm"
            >
              <div className="flex flex-grow flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium leading-tight">
                      {item.product.name}
                    </h4>
                    <div className="text-xs text-muted-foreground">
                      ${item.product.price} por unidad
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      ${(item.amount * item.product.price).toFixed(0)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(item.product)}
                      className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDecrement(item.product)}
                    disabled={item.amount <= 0}
                    className="h-6 w-6 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>

                  <Input
                    type="number"
                    min="0"
                    value={item.amount}
                    onChange={(e) => handleQuantityChange(item.product, e)}
                    className="h-6 w-12 text-center text-xs"
                  />

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleIncrement(item.product)}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <Button
        onClick={handlePurchase}
        disabled={isPending || items.length === 0}
        className="w-full"
        size="lg"
      >
        {isPending ? "Procesando..." : `Comprar - $${total.toFixed(0)}`}
      </Button>
    </div>
  );
}
