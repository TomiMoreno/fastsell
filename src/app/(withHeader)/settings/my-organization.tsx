"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

const schema = z.object({
  name: z.string().min(3, "Ingresa un nombre con al menos 3 caracteres"),
});

export default function MyOrganization() {
  const { data: organization, isLoading } =
    api.organizations.getMyOrganization.useQuery();
  const { toast } = useToast();
  const { mutate, isPending } = api.organizations.update.useMutation({
    onSuccess() {
      toast({
        title: "Has actualizado tu tienda correctamente",
        variant: "default",
      });
    },
    onError() {
      toast({
        title: "Error al actualizar tu tienda, intenta de nuevo",
        variant: "destructive",
      });
    },
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => mutate(data))}>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Image
                src={organization?.logo ?? "/images/placeholder.png"}
                width={80}
                height={80}
                alt="Logo de la tienda"
                className="rounded-full"
              />
              <div>
                <CardTitle>Tu tienda</CardTitle>
                <CardDescription>
                  Actualiza los datos de tu tienda
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tu tienda"
                        defaultValue={organization?.name}
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t border-t-foreground/10 px-6 py-4">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Actualizar
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
}
