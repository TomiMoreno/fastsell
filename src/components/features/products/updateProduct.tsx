"use client";
/* eslint-disable @typescript-eslint/no-misused-promises */
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { toast } from "~/components/ui/use-toast";
import {
  updateProductSchema,
  type UpdateProductSchema,
} from "~/lib/schemas/product";
import { fileHelper } from "~/lib/utils";
import { api } from "~/trpc/react";

type UpdateProductProps = {
  product: UpdateProductSchema;
};

const schema = updateProductSchema.merge(
  z.object({
    newImage: z.instanceof(File).optional(),
  }),
);
type UpdateProduct = z.infer<typeof schema>;

function UpdateProduct({ product }: UpdateProductProps) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="default">
          <Edit className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Edita el producto</SheetTitle>
          <SheetDescription>
            Acá es donde editas el producto seleccionado crack!
          </SheetDescription>
        </SheetHeader>
        <ProductForm closeSheet={() => setOpen(false)} product={product} />
      </SheetContent>
    </Sheet>
  );
}

const ProductForm = ({
  closeSheet,
  product,
}: UpdateProductProps & { closeSheet: () => void }) => {
  const form = useForm<UpdateProduct>({
    resolver: zodResolver(schema),
    defaultValues: product,
    mode: "onBlur",
  });
  const context = api.useUtils();
  const { mutateAsync, isPending } = api.product.update.useMutation({
    onSuccess: () => {
      void context.product.getAll.invalidate();
    },
  });
  async function onSubmit({ newImage, ...values }: UpdateProduct) {
    const base64 = newImage && (await fileHelper.toBase64(newImage));
    const createdValues = await mutateAsync({
      ...values,
      base64,
    });
    closeSheet();
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
        <FormField
          control={form.control}
          name="newImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagen</FormLabel>
              <FormControl>
                <>
                  <Input
                    type="file"
                    {...field}
                    value={undefined}
                    onChange={(e) =>
                      e.target.files?.[0] && field.onChange(e.target.files[0])
                    }
                  />
                </>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          Actualizar!
        </Button>
      </form>
    </Form>
  );
};

export default UpdateProduct;
