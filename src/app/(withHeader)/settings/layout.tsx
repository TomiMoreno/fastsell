import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { env } from "~/env";

export const metadata = {
  title: "FastSell - Settings",
  description: "Settings Page",
};

const routes = ["general"];
if (env.NODE_ENV === "development") routes.push("development");

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex grow flex-col gap-6 px-14 py-10">
      <h1 className="text-3xl font-semibold">Configuración</h1>
      <div className="flex gap-6">
        <Sidebar routes={routes} />
        {children}
      </div>
    </div>
  );
}
