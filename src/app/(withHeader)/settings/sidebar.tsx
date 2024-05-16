"use client";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { cn } from "~/lib/utils";

export function Sidebar({ routes }: { routes: string[] }) {
  const layoutSegment = useSelectedLayoutSegment();
  return (
    <aside className="min-w-[180px]">
      <nav className="flex flex-col gap-4 text-sm font-semibold text-foreground/60 transition-colors">
        {routes.map((route) => (
          <Link
            key={route}
            href={route}
            className={cn(
              "first-letter:capitalize hover:text-foreground/80",
              layoutSegment === route && "text-foreground",
            )}
          >
            {route}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
