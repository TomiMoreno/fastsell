import ProductTable from "~/components/features/products/productTable";

export default function Products() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-2xl font-extrabold sm:text-[3rem]">Productos</h1>
        </div>
        <ProductTable />
      </main>
    </>
  );
}
