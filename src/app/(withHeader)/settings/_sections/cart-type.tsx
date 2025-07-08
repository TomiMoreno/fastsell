"use client";
import useCartType from "~/components/features/cart/useCartType";
import { Card, CardContent } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export default function CartType() {
  const { cartType, setCartType } = useCartType();
  return (
    <Card>
      <CardContent className="flex flex-col gap-2 py-6">
        <label className="font-medium">Tipo de vista del carrito</label>
        <Select
          value={cartType}
          onValueChange={(value) =>
            setCartType(value as "compact" | "list" | "table")
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="compact">Compacto</SelectItem>
            <SelectItem value="list">Lista</SelectItem>
            <SelectItem value="table">Tabla</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
