"use client";
import { Grid, List } from "lucide-react";
import { useState } from "react";
import CompactProductGrid from "~/components/features/cart/compactProductGrid";
import ProductGrid from "~/components/features/cart/productGrid";
import { Button } from "~/components/ui/button";

export default function CartView() {
  const [isCompactView, setIsCompactView] = useState(true);

  return (
    <div className="container mx-auto py-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Carrito de Compras</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCompactView(!isCompactView)}
          className="flex items-center gap-2"
        >
          {isCompactView ? (
            <>
              <List className="h-4 w-4" />
              Vista Lista
            </>
          ) : (
            <>
              <Grid className="h-4 w-4" />
              Vista Compacta
            </>
          )}
        </Button>
      </div>

      {isCompactView ? <CompactProductGrid /> : <ProductGrid />}
    </div>
  );
}
