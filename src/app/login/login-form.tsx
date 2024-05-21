"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
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
  email: z.string().email("Ingresa un Email válido"),
  password: z
    .string()
    .min(8, {
      message: "La contraseña debe tener al menos 8 caracteres",
    })
    .max(20, {
      message: "La contraseña no puede tener más de 20 caracteres",
    }),
});

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const ctx = api.useUtils();
  const { mutate, status } = api.auth.signIn.useMutation({
    onSuccess() {
      router.push("/");
      toast({
        title: "Has iniciado sesión correctamente",
        variant: "default",
      });
      void ctx.invalidate();
    },
    onError() {
      toast({
        title: "Error al iniciar sesión, verifica tus credenciales",
        variant: "destructive",
      });
    },
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit((data) => mutate(data))}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="tomimoreno03@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={status === "pending"}
        >
          {status === "pending" && (
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          )}
          Inicia sesión
        </Button>
      </form>
    </Form>
  );
}
