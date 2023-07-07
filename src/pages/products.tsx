import CreateProduct from "~/components/features/products/createProduct";
import ProductTable from "~/components/features/products/productTable";

export default function Products() {
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
