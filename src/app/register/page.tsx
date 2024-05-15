import Image from "next/image";
import Link from "next/link";

import LoginForm from "./register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 ">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Registrate</h1>
            <p className="text-balance text-muted-foreground">
              Ingresa tus datos para crear una cuenta
            </p>
          </div>
          <LoginForm />
          <div className="mt-4 text-center text-sm">
            Ya tienes una cuenta?{" "}
            <Link href="/register" className="underline">
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/images/login-background.png"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.7] "
        />
      </div>
    </div>
  );
}
