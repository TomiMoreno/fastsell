"use client";
import { TrashIcon } from "lucide-react";
import { useToast } from "~/components/ui/use-toast";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api, type RouterOutputs } from "~/trpc/react";

export default function DeleteProduct({
  product,
}: {
  product: RouterOutputs["product"]["getAll"][number];
}) {
  const { toast } = useToast();
  const utils = api.useUtils();
  const { mutate: deleteMutation, isPending } = api.product.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Producto eliminado",
      });
    },
    onSettled: () => {
      void utils.product.getAll.invalidate();
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon"
          title="Delete product"
          disabled={isPending}
        >
          <TrashIcon size={16} strokeWidth={2} absoluteStrokeWidth />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Estás seguro de eliminar {product.name}? </DialogTitle>
          <DialogDescription>Esta acción es irreversible.</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            onClick={() => {
              deleteMutation(product.id);
            }}
            variant="destructive"
          >
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
