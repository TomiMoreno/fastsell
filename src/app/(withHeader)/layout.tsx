import type { ReactNode } from "react";
import Header from "~/components/ui/header";
import { api } from "~/trpc/server";

export default async function Layout({ children }: { children: ReactNode }) {
  const user = await api.auth.me();
  return (
    <>
      <Header fullName={user?.fullName} />
      {children}
    </>
  );
}
