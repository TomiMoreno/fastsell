"use client";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "~/config/site";
import { cn } from "~/lib/utils";
import { Button } from "../../../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../components/ui/sheet";

const routes = [
  {
    name: "Carrito",
    path: "/cart",
  },
  {
    name: "Productos",
    path: "/products",
  },
  {
    name: "Ventas",
    path: "/sales",
  },
  {
    name: "Transacciones",
    path: "/transactions",
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 hidden items-center space-x-2 sm:flex">
        <span className=" inline-block font-bold text-primary">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center text-sm font-medium sm:space-x-6">
        {routes.map((route) => (
          <Link
            key={route.path}
            href={route.path}
            className={cn(
              "hidden transition-colors hover:text-foreground/80 sm:block",
              pathname === route.path
                ? "text-foreground"
                : "text-foreground/60",
            )}
          >
            {route.name}
          </Link>
        ))}
        <MobileNav />
      </nav>
    </div>
  );
}

function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="sm:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="mr-6 flex items-center space-x-2"
            >
              <span className=" inline-block font-bold text-primary">
                {siteConfig.name}
              </span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <nav className="my-4 flex flex-col gap-1 pl-2">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={cn(
                "text-lg transition-colors hover:text-foreground/80",
                pathname === route.path
                  ? "text-foreground"
                  : "text-foreground/60",
              )}
              onClick={() => setOpen(false)}
            >
              {route.name}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
