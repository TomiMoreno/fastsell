"use client";

/* eslint-disable @typescript-eslint/no-misused-promises */
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  email: z.string().email("Ingresa un Email correcto"),
  password: z
    .string()
    .min(8, {
      message: "El password tiene que ser de minimo 8 caracteres",
    })
    .max(20, {
      message: "Pasaste el limite de 20 caracteres",
    }),
});
export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  return (
    <div className="mt-[60px]">
      <div className="flex flex-col gap-7 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-secondary-foreground sm:text-[5rem]">
          FastSell
        </h1>
        <p className="text-xl text-secondary-foreground">
          Logueate para continuar!
        </p>

        <form onSubmit={handleSubmit((data) => console.log(data))}>
          <div className="flex flex-col gap-2">
            <Input
              type="email"
              placeholder="Email"
              required
              {...register("email")}
            />
            <Input
              type="password"
              placeholder="Password"
              required
              {...register("password")}
            />
            <Button variant={"accent"} type="submit">
              Iniciar sesión
            </Button>
          </div>
        </form>
        <div className="text-sm font-medium text-destructive">
          {JSON.stringify(errors.email?.message)}
        </div>
        <div className="text-sm font-medium text-destructive">
          {JSON.stringify(errors.password?.message)}
        </div>
      </div>
    </div>
  );
}
