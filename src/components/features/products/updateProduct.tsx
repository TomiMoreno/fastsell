"use client";
/* eslint-disable @typescript-eslint/no-misused-promises */
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import Field from "~/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { toast } from "~/components/ui/use-toast";
import type { Product } from "~/lib/schemas/product";
import { updateProductSchema } from "~/lib/schemas/product";
import { fileHelper } from "~/lib/utils";
import { api } from "~/trpc/react";

type UpdateProductProps = {
  product: Product;
};

const schema = updateProductSchema.merge(
  z.object({
    newImage: z.instanceof(File).nullable().optional(),
  }),
);
type UpdateProduct = z.infer<typeof schema>;

function UpdateProduct({ product }: UpdateProductProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] flex-col">
        <DialogHeader>
          <DialogTitle>Edita el producto</DialogTitle>
          <DialogDescription>
            Acá es donde editas el producto seleccionado crack!
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-1 py-2">
          <ProductForm closeModal={() => setOpen(false)} product={product} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

const ProductForm = ({
  closeModal,
  product,
}: UpdateProductProps & { closeModal: () => void }) => {
  const form = useForm<UpdateProduct>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      hotkey: product.hotkey,
      category: product.category ?? undefined,
    },
    mode: "onBlur",
  });
  const context = api.useUtils();
  const { mutateAsync, isPending } = api.product.update.useMutation({
    onSuccess: () => {
      void context.product.getAll.invalidate();
    },
  });
  async function onSubmit({ newImage, ...values }: UpdateProduct) {
    let base64: string | undefined;

    if (newImage instanceof File) {
      base64 = await fileHelper.toBase64(newImage);
    } else if (newImage === null) {
      // User wants to remove the image
      base64 = "";
    }

    const createdValues = await mutateAsync({
      ...values,
      base64,
    });
    closeModal();
    toast({
      title: "Producto actualizado!",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(createdValues, null, 2)}
          </code>
        </pre>
      ),
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full flex-col"
      >
        <div className="space-y-8 pb-20">
          <Field name="name" label="Nombre" control={form.control} />
          <Field
            name="price"
            label="Precio"
            control={form.control}
            type="number"
          />
          <Field
            name="stock"
            label="Stock"
            control={form.control}
            type="number"
          />
          <Field name="hotkey" label="Hotkey" control={form.control} />
          <Field
            name="category"
            label="Categoría"
            control={form.control}
            placeholder="bebida, comida, postre"
          />
          <FormField
            control={form.control}
            name="newImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagen</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {/* Current Image */}
                    {product.image && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Imagen actual:
                        </p>
                        <div className="relative inline-block">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={128}
                            height={128}
                            className="h-32 w-32 rounded-md border object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-0"
                            onClick={() => {
                              // Set a flag to remove the image
                              field.onChange(null);
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* New Image Input */}
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {product.image ? "Cambiar imagen:" : "Agregar imagen:"}
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        {...field}
                        value={undefined}
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          field.onChange(e.target.files[0])
                        }
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter className="sticky bottom-0 left-0 right-0 z-10 border-t bg-background py-4">
          <Button type="submit" disabled={isPending} className="w-full">
            Actualizar!
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UpdateProduct;
