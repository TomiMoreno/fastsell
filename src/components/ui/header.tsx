import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "~/config/site";
import { cn } from "~/lib/utils";

function Header() {
  return (
    <header className="flex items-center justify-between border-b border-foreground/10 p-4">
      <MainNav />
    </header>
  );
}

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <span className=" inline-block font-bold">{siteConfig.name}</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/cart"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/cart" ? "text-foreground" : "text-foreground/60"
          )}
        >
          Cart
        </Link>
        <Link
          href="/products"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/products")
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          Products
        </Link>
      </nav>
    </div>
  );
}
export default Header;
