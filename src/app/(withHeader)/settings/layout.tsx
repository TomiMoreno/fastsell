import type { ReactNode } from "react";

export const metadata = {
  title: "FastSell - Settings",
  description: "Settings Page",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex grow flex-col gap-6 px-14 py-10">
      <h1 className="text-3xl font-semibold">Configuración</h1>
      <div className="flex gap-6">{children}</div>
    </div>
  );
}
