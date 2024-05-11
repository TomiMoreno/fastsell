"use client";
/* eslint-disable @typescript-eslint/no-misused-promises */
import { LayoutDashboardIcon } from "lucide-react";
import { useCallback, useRef, useState, type ChangeEvent } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";
import { type Product } from "~/lib/schemas/product";
import { useCart } from "~/lib/store";
import { api } from "~/trpc/react";
import ProductCard from "./productCard";
import useHotkeys from "./useHotkeys";

function ProductGrid() {
  const [search, setSearch] = useState("");
  const [numberOfCols, setNumberOfCols] = useLocalStorage<number>(
    "numberOfCols",
    1,
    {
      initializeWithValue: false,
    }
  );
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
      product.name.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

  useHotkeys({
    ref,
    handleBuy,
    activateHotkeys: true,
  });

  if (isPending) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container mx-auto py-10">
      <div className="flex w-full items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Productos</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" title="Change layout">
              <LayoutDashboardIcon strokeWidth={1} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Cantidad de columnas</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={numberOfCols === 1}
              onClick={() => setNumberOfCols(1)}
            >
              1 Columna
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={numberOfCols === 2}
              onClick={() => setNumberOfCols(2)}
              className="hidden sm:block"
            >
              2 Columnas
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={numberOfCols === 3}
              onClick={() => setNumberOfCols(3)}
              className="hidden lg:block"
            >
              3 Columnas
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
      <div
        className="max-w-xxl mx-auto grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${numberOfCols}, 1fr)`,
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
