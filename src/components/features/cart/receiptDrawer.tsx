"use client";
import { Receipt } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { useCart } from "~/lib/store";
import EditableReceipt from "./editableReceipt";

interface ReceiptDrawerProps {
  children?: React.ReactNode;
  className?: string;
}

export default function ReceiptDrawer({
  children,
  className,
}: ReceiptDrawerProps) {
  const {
    items,
    computed: { total },
  } = useCart();

  const itemCount = items.size;

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children ?? (
          <Button variant="outline" className={`${className} relative`}>
            <Receipt className="mr-2 h-4 w-4" strokeWidth={1} />
            Ver carrito
            {itemCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
              >
                {itemCount > 99 ? "99+" : itemCount}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Carrito de Compras</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <EditableReceipt items={Array.from(items.values())} total={total} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
