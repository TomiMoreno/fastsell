import { redirect } from "next/navigation";
import { validateRequest } from "~/server/auth";
import SalesPage from "./salesPage";

export default async function Sales() {
  const { session } = await validateRequest();
  if (!session) redirect("/login");

  return <SalesPage />;
}
