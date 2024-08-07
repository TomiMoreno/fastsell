"use client";
import { CircleIcon, PlusIcon } from "@radix-ui/react-icons";
import { MinusIcon, ShoppingBagIcon } from "lucide-react";
import Image from "next/image";
import { type ChangeEvent } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Kbd } from "~/components/ui/kbd";
import { Separator } from "~/components/ui/separator";
import { type Product } from "~/lib/schemas/product";
import { formatCurrency } from "~/lib/utils";

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
      className="focus:ring-red flex h-44 flex-row gap-4 p-6 transition-all hover:shadow-lg active:outline-none active:ring-2"
      id={`p-${product.id}`}
    >
      <Image
        src={product.image || "/images/placeholder.webp"}
        alt={product.name}
        className="h-20 w-20 self-center rounded-md bg-transparent dark:bg-card-foreground"
        width={80}
        height={80}
        loading="lazy"
      />
      <div className="flex flex-grow flex-col space-y-2 ">
        <CardHeader className="flex flex-grow flex-row items-center justify-between p-0">
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
        <CardContent className="flex flex-row flex-wrap items-center justify-between p-0">
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CircleIcon className="mr-1 h-3 w-3 fill-primary stroke-primary text-primary" />
              {product.stock}
            </div>
            <div className="flex items-center">
              <ShoppingBagIcon className="mr-1 h-3 w-3" />
              {formatCurrency(product.price)}
            </div>
            <div className="flex items-center">
              <Kbd className="w-fit" disabled={!Boolean(product.hotkey)}>
                {product.hotkey ?? "_"}
              </Kbd>
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
      </div>
    </Card>
  );
}
