import { redirect } from "next/navigation";
import SalesDashboard from "~/components/features/sales/dashboard";
import SalesTable from "~/components/features/sales/salesTable";
import { validateRequest } from "~/server/auth";

export default async function Sales() {
  const { session } = await validateRequest();
  if (!session) redirect("/login");
  return (
    <>
      <h1 className="w-full px-4 py-16 text-left text-2xl font-extrabold sm:text-[3rem]">
        Ventas
      </h1>
      <SalesDashboard />
      <SalesTable />
    </>
  );
}
