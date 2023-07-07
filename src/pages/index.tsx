import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-background ">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-3xl font-extrabold tracking-tight  sm:text-[5rem]">
            STOREEEEE
          </h1>
        </div>
        <Button size="lg">BUY NOW</Button>
        <Link href="/products">
          <Button variant="secondary" size="lg">
            Agregar producto
          </Button>
        </Link>
        <Button variant="destructive" size="lg">
          DESTROY NOW
        </Button>
      </main>
    </>
  );
}
