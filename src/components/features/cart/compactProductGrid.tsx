"use client";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";
import { type Product } from "~/lib/schemas/product";
import { useCart } from "~/lib/store";
import { api } from "~/trpc/react";
import CompactProductCard from "./compactProductCard";
import useHotkeys from "./useHotkeys";

function CompactProductGrid() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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

  // Extract all unique categories from products
  const allCategories = useMemo(() => {
    if (!products) return [];
    const categories = new Set<string>();
    products.forEach((product) => {
      if (product.category) {
        categories.add(product.category);
      }
    });
    return Array.from(categories).sort();
  }, [products]);

  // Filter products by search and category
  const filteredProducts: Product[] = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      // Search filter
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      // Category filter
      const matchesCategory =
        !selectedCategory || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const selectCategory = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };

  useHotkeys({
    ref,
    handleBuy: () => void handleBuy(),
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex w-full items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Productos</h1>
      </div>

      {/* Search Input */}
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        ref={ref}
        className="my-4"
        placeholder="Buscar producto"
      />

      {/* Category Filter */}
      {allCategories.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {allCategories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => selectCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
          {selectedCategory && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 h-6 text-xs"
              onClick={() => setSelectedCategory(null)}
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      )}

      <div className="flex flex-row justify-start gap-4">
        <div
          className="max-w-xxl grid flex-grow gap-3"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gridTemplateRows: "auto",
            height: "fit-content",
          }}
        >
          {filteredProducts.map((product) => (
            <CompactProductCard
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

        <Button
          variant="default"
          className="fixed bottom-2 left-8 right-8 col-span-full"
          onClick={() => handleBuy()}
        >
          Comprar carrito, Total {total.toFixed(0)}
        </Button>
      </div>
    </div>
  );
}

export default CompactProductGrid;
