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

const schema = z
  .object({
    email: z.string().email("Ingresa un Email válido"),
    name: z.string({
      required_error: "Ingresa tu nombre",
    }),
    lastName: z.string({
      required_error: "Ingresa tu apellido",
    }),
    repeatPassword: z.string(),
    password: z
      .string()
      .min(8, {
        message: "La contraseña debe tener al menos 8 caracteres",
      })
      .max(20, {
        message: "La contraseña no puede tener más de 20 caracteres",
      }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Las contraseñas no coinciden",
    path: ["repeatPassword"],
  });

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate, status } = api.auth.signUp.useMutation({
    onSuccess() {
      router.push("/");
      toast({
        title: "Te has registrado correctamente",
        variant: "default",
      });
    },
    onError() {
      toast({
        title: "Error al iniciar registrarte, por favor intenta de nuevo",
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apellido</FormLabel>
              <FormControl>
                <Input placeholder="Apellido" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="tomimoreno03@gmail.com"
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contraseña"
                  required
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="repeatPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repite tu contraseña</FormLabel>
              <FormControl>
                <Input
                  placeholder="Repite tu contraseña"
                  required
                  type="password"
                  {...field}
                />
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
          Registrate
        </Button>
      </form>
    </Form>
  );
}
