"use client";
import { CircleIcon, PlusIcon } from "@radix-ui/react-icons";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import { MinusIcon, ShoppingBagIcon } from "lucide-react";
import { formatCurrency } from "~/lib/utils";
import { type Product } from "~/lib/schemas/product";
import { Input } from "~/components/ui/input";
import { type ChangeEvent } from "react";

interface ProductCardProps {
  product: Product;
  plusOne: () => void;
  minusOne: () => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  amount: number;
}
export default function ProductCard({
  product,
  plusOne,
  minusOne,
  handleChange,
  amount,
}: ProductCardProps) {
  return (
    <Card
      className="focus:ring-red transition-all hover:shadow-lg active:outline-none active:ring-2"
      id={`p-${product.id}`}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xl">{product.name}</CardTitle>
        </div>
        <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
          <Button
            variant="secondary"
            className="px-2 shadow-none"
            onClick={plusOne}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-[20px]" />
          <Button
            variant="secondary"
            className="px-2 shadow-none"
            onClick={minusOne}
          >
            <MinusIcon className="h-4 w-4 text-secondary-foreground" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-row items-center justify-between">
        <div className="flex space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <CircleIcon className="mr-1 h-3 w-3 fill-primary stroke-primary text-primary" />
            {product.stock}
          </div>
          <div className="flex items-center">
            <ShoppingBagIcon className="mr-1 h-3 w-3" />
            {formatCurrency(product.price)}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Input
            type="number"
            value={amount ?? 0}
            className="w-16 text-center outline-none"
            onChange={handleChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
