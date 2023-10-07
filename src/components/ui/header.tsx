import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "~/config/site";
import { cn } from "~/lib/utils";
import { ModeToggle } from "../theme/modeToggle";

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
];

function Header() {
  return (
    <header className="flex items-center justify-between border-b border-foreground/10 bg-background p-4">
      <MainNav />
      <ModeToggle />
    </header>
  );
}

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <span className=" inline-block font-bold text-primary">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        {routes.map((route) => (
          <Link
            key={route.path}
            href={route.path}
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === route.path ? "text-foreground" : "text-foreground/60"
            )}
          >
            {route.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
export default Header;
