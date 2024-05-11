import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function Home() {
  return (
    <div className="container flex flex-col justify-center gap-12 px-4 py-16">
      <h1 className="text-3xl font-extrabold tracking-tight text-secondary-foreground sm:text-[5rem]">
        FastSell
      </h1>
      <p className="text-xl  text-secondary-foreground">
        Vende tus productos de forma rápida y sencilla
      </p>
      <div className="flex flex-wrap gap-4">
        <Link href="/products">
          <Button variant="secondary" size="lg">
            Administra tus productos
          </Button>
        </Link>
        <Link href="/cart">
          <Button size="lg">Crea una venta</Button>
        </Link>
      </div>
    </div>
  );
}
