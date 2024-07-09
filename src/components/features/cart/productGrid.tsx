"use client";
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Receipt } from "lucide-react";
import { useCallback, useRef, useState, type ChangeEvent } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";
import { type Product } from "~/lib/schemas/product";
import { useCart } from "~/lib/store";
import { api } from "~/trpc/react";
import ProductCard from "./productCard";
import ProductsResume from "./productsResume";
import useHotkeys from "./useHotkeys";

function ProductGrid() {
  const [search, setSearch] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { data: products } = api.product.getAll.useQuery();
  const utils = api.useUtils();
  const { mutateAsync, isPending } = api.sale.create.useMutation({
    onSuccess: () => {
      void utils.product.getAll.invalidate();
      reset();
    },
  });
  const {
    addToCart,
    changeAmount,
    removeFromCart,
    reset,
    items,
    computed: { total },
  } = useCart();

  const handleBuy = useCallback(async () => {
    await mutateAsync({ productMap: items });
    toast({
      title: "Compra realizada",
    });
    setSearch("");
  }, [items, mutateAsync, toast]);

  const filteredProducts: Product[] =
    products?.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()),
    ) ?? [];

  useHotkeys({
    ref,
    handleBuy,
  });

  if (isPending) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container mx-auto py-10">
      <div className="flex w-full items-center justify-between gap-4 ">
        <h1 className="text-3xl font-bold">Productos</h1>
        <div className="flex flex-row gap-4">
          <Button
            onClick={() => setShowReceipt((showReceipt) => !showReceipt)}
            size="icon"
            variant={showReceipt ? "accent" : "outline"}
          >
            <Receipt strokeWidth={1} />
          </Button>
        </div>
      </div>
      <Input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        ref={ref}
        className="my-4"
        placeholder="Buscar producto"
      />
      <div className="flex flex-row justify-start gap-4">
        <div
          className="max-w-xxl grid flex-grow gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
            gridTemplateRows: "auto",
            height: "fit-content",
          }}
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              plusOne={() => addToCart(product)}
              minusOne={() => removeFromCart(product)}
              handleChange={(e: ChangeEvent<HTMLInputElement>) => {
                const value = Math.max(parseInt(e.target.value), 0);
                changeAmount(product, value || 0);
              }}
              amount={items.get(product.id)?.amount ?? 0}
            />
          ))}
        </div>
        {showReceipt && (
          <>
            <div className="grow-0 basis-[300px]">
              <ProductsResume
                items={Array.from(items.values())}
                total={total}
              />
            </div>
          </>
        )}
        <Button
          variant="default"
          className="fixed bottom-2 left-8 right-8 col-span-full "
          onClick={() => handleBuy()}
        >
          Comprar carrito, Total {total.toFixed(0)}
        </Button>
      </div>
    </div>
  );
}

export default ProductGrid;
