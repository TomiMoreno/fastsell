import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function Home() {
  return (
    <>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-3xl font-extrabold tracking-tight  sm:text-[5rem]">
          TIENDAAAAAAAA
        </h1>
      </div>
      <Button size="lg">COMPRAR AHORA</Button>
      <Link href="/products">
        <Button variant="secondary" size="lg">
          Agregar producto
        </Button>
      </Link>
      <Button
        variant="destructive"
        size="lg"
        className="fixed bottom-5 right-5"
        onClick={() => {
          document.body.innerHTML = "💥".repeat(10000);
        }}
      >
        DESTRUIR AHORA
      </Button>
    </>
  );
}
