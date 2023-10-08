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
import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateProductSchema,
  createProductSchema,
} from "~/lib/schemas/product";
import { toast } from "~/components/ui/use-toast";
import { useState } from "react";
import { Plus } from "lucide-react";
import Field from "~/components/ui/field";

function CreateProduct() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="default">
          <Plus className="mr-2 h-4 w-4" />
          Agregar producto
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Agrega un nuevo producto</SheetTitle>
          <SheetDescription>
            Acá es donde podes agregar un nuevo producto
          </SheetDescription>
        </SheetHeader>
        <ProductForm closeSheet={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

const ProductForm = ({ closeSheet }: { closeSheet: () => void }) => {
  const form = useForm<CreateProductSchema>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      price: 0,
      stock: 0,
    },
    mode: "onBlur",
  });
  const context = api.useContext();
  const { mutateAsync, isLoading } = api.product.create.useMutation({
    onSuccess: () => {
      void context.product.getAll.invalidate();
    },
  });
  async function onSubmit(values: CreateProductSchema) {
    const createdValues = await mutateAsync(values);
    closeSheet();
    toast({
      title: "Producto agregado!",
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
        <Button type="submit" disabled={isLoading}>
          Agregar!
        </Button>
      </form>
    </Form>
  );
};

export default CreateProduct;
