"use client";
/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProductSchema,
  type UpdateProductSchema,
} from "~/lib/schemas/product";
import { toast } from "~/components/ui/use-toast";
import { useState } from "react";
import { Edit } from "lucide-react";
import Field from "~/components/ui/field";

type UpdateProductProps = {
  product: UpdateProductSchema;
};

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
  const form = useForm<UpdateProductSchema>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: product,
    mode: "onBlur",
  });
  const context = api.useUtils();
  const { mutateAsync, isPending } = api.product.update.useMutation({
    onSuccess: () => {
      void context.product.getAll.invalidate();
    },
  });
  async function onSubmit(values: UpdateProductSchema) {
    console.log(values);
    const createdValues = await mutateAsync(values);
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
        <Button type="submit" disabled={isPending}>
          Actualizar!
        </Button>
      </form>
    </Form>
  );
};

export default UpdateProduct;
