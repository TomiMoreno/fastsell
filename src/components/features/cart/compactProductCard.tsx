"use client";
import { CircleIcon, PlusIcon } from "@radix-ui/react-icons";
import { MinusIcon, ShoppingBagIcon } from "lucide-react";
import { type ChangeEvent } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Kbd } from "~/components/ui/kbd";
import { ProductImage } from "~/components/ui/product-image";
import { type Product } from "~/lib/schemas/product";
import { formatCurrency } from "~/lib/utils";

interface CompactProductCardProps {
  product: Product;
  plusOne: () => void;
  minusOne: () => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  amount: number;
}

export default function CompactProductCard({
  product,
  plusOne,
  minusOne,
  handleChange,
  amount,
}: CompactProductCardProps) {
  const category = product.category;

  return (
    <Card
      className="group relative aspect-square cursor-pointer overflow-hidden transition-all hover:shadow-lg"
      id={`p-${product.id}`}
      onClick={plusOne}
    >
      {/* Product Image */}
      <div className="relative h-full w-full">
        {/* Hotkey - Always visible */}
        {product.hotkey?.trim() && (
          <div className="absolute right-2 top-2 z-10">
            <Kbd
              className="w-fit border-white/20 bg-black/80 text-white"
              disabled={false}
            >
              {product.hotkey}
            </Kbd>
          </div>
        )}

        <ProductImage
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
          fill
        />

        {/* Overlay with controls - only visible on hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex h-full flex-col justify-between p-3">
            {/* Top section - Category only */}
            <div className="flex items-start justify-between">
              <div className="flex flex-wrap gap-1">
                {category && (
                  <Badge variant="secondary" className="text-xs">
                    {category}
                  </Badge>
                )}
              </div>
            </div>

            {/* Bottom section - Product info and controls */}
            <div className="space-y-2">
              {/* Product name and price */}
              <div className="text-white">
                <h3 className="line-clamp-2 text-sm font-semibold">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center">
                    <ShoppingBagIcon className="mr-1 h-3 w-3" />
                    {formatCurrency(product.price)}
                  </span>
                  <span className="flex items-center">
                    <CircleIcon className="mr-1 h-3 w-3 fill-white stroke-white" />
                    {product.stock}
                  </span>
                </div>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center space-x-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={minusOne}
                  >
                    <MinusIcon className="h-3 w-3" />
                  </Button>
                  <Input
                    type="number"
                    value={amount ?? 0}
                    className="h-6 w-12 bg-background text-center text-xs"
                    onChange={handleChange}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={plusOne}
                  >
                    <PlusIcon className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
