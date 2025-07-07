import { redirect } from "next/navigation";
import { validateRequest } from "~/server/auth";
import CartView from "./cartView";

export default async function Cart() {
  const { session } = await validateRequest();
  if (!session) redirect("/login");

  return <CartView />;
}
