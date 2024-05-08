import { TrashIcon } from "lucide-react";
import { useToast } from "~/components/ui/use-toast";
import { api, type RouterOutputs } from "~/utils/api";
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

export default function DeleteProduct({
  product,
}: {
  product: RouterOutputs["product"]["getAll"][number];
}) {
  const { toast } = useToast();
  const context = api.useContext();
  const { mutate: deleteMutation, isLoading } = api.product.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Producto eliminado",
      });
    },
    onSettled: () => {
      void context.product.getAll.invalidate();
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon"
          title="Delete product"
          disabled={isLoading}
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
