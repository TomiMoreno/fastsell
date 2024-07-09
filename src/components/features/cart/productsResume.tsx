import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { type Product } from "~/lib/schemas/product";

export default function ProductsResume({
  items,
  total,
}: {
  items: { product: Product; amount: number }[];
  total: number;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Detalles de la compra
          </CardTitle>
          <CardDescription>Total: ${total.toFixed(0)}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <ul className="grid gap-3">
            {items.map((item) => (
              <li
                className="flex items-center justify-between"
                key={item.product.id}
              >
                <div className="flex flex-col">
                  <span className="text-sm">{item.product.name}</span>

                  <span className="text-xs text-muted-foreground">
                    {item.amount} unidad{item.amount > 1 ? "es" : ""} a $
                    {item.product.price}
                  </span>
                </div>
                <span className="text-sm">
                  ${(item.amount * item.product.price).toFixed(0)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          <span className="font-semibold">Total:</span> ${total.toFixed(0)}
        </div>
      </CardFooter>
    </Card>
  );
}
