import type { ReactNode } from "react";
import Header from "~/components/ui/header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
