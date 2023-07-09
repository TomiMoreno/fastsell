/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { type ChangeEvent } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import ProductCard from "./productCard";
import { useCart } from "~/lib/store";
import { useToast } from "~/components/ui/use-toast";

function ProductGrid() {
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
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold">Productos</h1>
      <h2 className="text-xl font-bold">Total: {total}</h2>
      <div className="max-w-xxl grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.map((product) => (
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
          className="col-span-full"
          onClick={() => handleBuy()}
        >
          Comprar carrito
        </Button>
      </div>
    </div>
  );
}

export default ProductGrid;
