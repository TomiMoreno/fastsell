import { redirect } from "next/navigation";
import ProductGrid from "~/components/features/cart/productGrid";
import { validateRequest } from "~/server/auth";

export default async function Cart() {
  const { session } = await validateRequest();
  if (!session) redirect("/login");
  return <ProductGrid />;
}
