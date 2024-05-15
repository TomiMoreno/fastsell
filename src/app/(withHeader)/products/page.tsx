import { redirect } from "next/navigation";
import CreateProduct from "~/components/features/products/createProduct";
import ProductTable from "~/components/features/products/productTable";
import { validateRequest } from "~/server/auth";

export default async function Products() {
  const { session } = await validateRequest();
  if (!session) redirect("/login");
  return (
    <>
      <div className="container flex flex-row justify-between gap-12 px-4 py-16">
        <h1 className="text-2xl font-extrabold sm:text-[3rem]">Productos</h1>
        <CreateProduct />
      </div>
      <ProductTable />
    </>
  );
}
