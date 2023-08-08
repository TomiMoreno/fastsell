/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState, type ChangeEvent, useRef } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import ProductCard from "./productCard";
import { useCart } from "~/lib/store";
import { useToast } from "~/components/ui/use-toast";
import { Input } from "~/components/ui/input";

function ProductGrid() {
  const [seacrh, setSeacrh] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { data } = api.product.getAll.useQuery();
  const context = api.useContext();
  const { mutateAsync, isLoading } = api.sale.create.useMutation({
    onSuccess: () => {
      void context.product.getAll.invalidate();
      reset();
    },
  });
  const { addToCart, changeAmount, removeFromCart, reset, items, total } =
    useCart();

  const handleBuy = async () => {
    await mutateAsync({ productMap: items });
    toast({
      title: "Compra realizada",
    });
    setSeacrh("");
    ref.current?.focus();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold">Productos</h1>
      <Input
        value={seacrh}
        onChange={(e) => setSeacrh(e.target.value)}
        ref={ref}
        className="my-4"
        placeholder="Buscar producto"
      />
      <div className="max-w-xxl mx-auto grid grid-cols-1 gap-4">
        {data
          ?.filter((product) =>
            product.name.toLowerCase().includes(seacrh.toLowerCase())
          )
          .map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              plusOne={() => addToCart(product, product.price)}
              minusOne={() => removeFromCart(product, product.price)}
              handleChange={(e: ChangeEvent<HTMLInputElement>) => {
                const value = parseInt(e.target.value);
                changeAmount(product, product.price, value);
              }}
              amount={items.get(product.id)?.amount ?? 0}
            />
          ))}
        <Button
          variant="default"
          className="fixed bottom-2 left-8 right-8 col-span-full "
          onClick={() => handleBuy()}
        >
          Comprar carrito, Total {total}
        </Button>
      </div>
    </div>
  );
}

export default ProductGrid;
