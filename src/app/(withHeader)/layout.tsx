import { Suspense, type ReactNode } from "react";
import { MainNav } from "~/app/(withHeader)/components/header";
import UserNav from "./components/user-nav";

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="flex items-center justify-between border-b border-foreground/10 bg-background p-4 print:hidden">
        <MainNav />
        <Suspense>
          <UserNav />
        </Suspense>
      </header>
      {children}
    </>
  );
}
