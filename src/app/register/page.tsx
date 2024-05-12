"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email("Ingresa un Email correcto"),
  name: z.string(),
  lastName: z.string(),
  repeatPassword: z.string(),
  password: z
    .string()
    .min(8, {
      message: "El password tiene que ser de minimo 8 caracteres",
    })
    .max(20, {
      message: "Pasaste el limite de 20 caracteres",
    }),
});
export default function Register() {
  const router = useRouter();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      lastName: "",
      password: "",
      repeatPassword: "",
    },
  });

  const register = api.auth.signUp.useMutation({
    onSuccess() {
      router.push("/");
    },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    register.mutate(values);
  }

  return (
    <main className="flex grow flex-col items-center justify-start bg-background">
      <div className="container relative hidden h-screen flex-col items-center justify-center bg-black p-0 md:grid lg:max-w-none lg:grid-cols-2">
        <div className="flex h-screen  items-center bg-zinc-900">
          <h1 className="px-[25%] text-3xl font-extrabold tracking-tight text-secondary-foreground sm:text-[5rem] ">
            FastSell
          </h1>
        </div>
        <div className="mt-[10%] flex w-full flex-col  gap-8 bg-black px-3 text-left ">
          <div className="flex w-full flex-col px-[20%]">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" required {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last Name" required {...field} />
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
                        <Input placeholder="Email" required {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Password"
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
                      <FormLabel>Repeat your password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Repeat your password"
                          required
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center">
                  <Button type="submit" variant={"accent"}>
                    Registrate
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          <a href="/login">
            <p className="text-center text-xl text-secondary-foreground">
              Ya tienes cuenta?
            </p>
          </a>
        </div>
      </div>
    </main>
  );
}
