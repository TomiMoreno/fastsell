"use client";

/* eslint-disable @typescript-eslint/no-misused-promises */
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  return (
    <div className="container relative hidden h-screen flex-col items-center justify-center p-0 md:grid lg:max-w-none lg:grid-cols-2">
      <div className="flex h-screen w-full items-center self-center bg-gray-800 px-[25%]  align-middle">
        <div className="flex flex-col ">
          <h1 className="text-3xl font-extrabold tracking-tight text-secondary-foreground sm:text-[5rem] ">
            FastSell
          </h1>
        </div>
      </div>
      <div className="mt-[10%] flex flex-col gap-8 bg-black px-3 text-center">
        <form onSubmit={handleSubmit((data) => console.log(data))}>
          <div className="flex flex-col gap-2">
            <p className="mt-7 text-xl text-secondary-foreground">
              Create an account
            </p>
            <Input
              type="text"
              placeholder="Name"
              required
              {...register("name")}
            />
            <Input
              type="text"
              placeholder="Last Name"
              required
              {...register("lastName")}
            />
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
            <Input
              type="password"
              placeholder="Repeat your password"
              required
              {...register("repeatPassword")}
            />
            <Button variant={"accent"} type="submit">
              Registrate
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
