/* eslint-disable @typescript-eslint/no-misused-promises */
import React, {
  useState,
  type ChangeEvent,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import ProductCard from "./productCard";
import { useCart } from "~/lib/store";
import { useToast } from "~/components/ui/use-toast";
import { Input } from "~/components/ui/input";
import { type Product } from "~/lib/schemas/product";

function ProductGrid() {
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { data: products } = api.product.getAll.useQuery();
  const context = api.useContext();
  const { mutateAsync: buyProducts, isLoading } = api.sale.create.useMutation({
    onSuccess: () => {
      void context.product.getAll.invalidate();
      reset();
    },
  });
  const { addToCart, changeAmount, removeFromCart, reset, items, total } =
    useCart();

  const handleBuy = useCallback(async () => {
    await buyProducts({ productMap: items });
    toast({
      title: "Compra realizada",
    });
    setSearch("");
  }, [items, buyProducts, toast]);

  const filteredProducts: Product[] =
    products?.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

  // Add hotkeys to add products to cart
  useEffect(() => {
    const hotkeys =
      products?.reduce((acc, product) => {
        if (product.hotkey) {
          acc[product.hotkey] = {
            add: () => addToCart(product),
            remove: () => removeFromCart(product),
            product,
          };
        }
        return acc;
      }, {} as Record<string, { add: () => void; remove: () => void; product: Product }>) ??
      {};

    const handleKeyDown = (e: KeyboardEvent) => {
      if (ref.current?.contains(e.target as Node)) return;
      const keyPressed = e.key.toLocaleLowerCase();
      if (keyPressed === "f1") {
        e.preventDefault();
        handleBuy().catch(console.error);
        return;
      }

      const key = hotkeys[keyPressed];
      if (!key) return;
      if (e.shiftKey) key.remove();
      else key.add();
      const elementToScroll = document.getElementById(`p-${key.product.id}`);
      elementToScroll?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [products, addToCart, removeFromCart, handleBuy, reset]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold">Productos</h1>
      <Input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        ref={ref}
        className="my-4"
        placeholder="Buscar producto"
      />
      <div className="max-w-xxl mx-auto grid grid-cols-1 gap-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            plusOne={() => addToCart(product)}
            minusOne={() => removeFromCart(product)}
            handleChange={(e: ChangeEvent<HTMLInputElement>) => {
              const value = parseInt(e.target.value);
              changeAmount(product, value);
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
