"use client";
import CompactProductGrid from "~/components/features/cart/compactProductGrid";
import ProductGrid from "~/components/features/cart/productGrid";
import useCartType from "~/components/features/cart/useCartType";
import ProductTable from "~/components/features/products/productTable";

export default function CartView() {
  const { cartType } = useCartType();

  return (
    <div className="container mx-auto py-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Carrito de Compras</h1>
      </div>

      {cartType === "compact" ? (
        <CompactProductGrid />
      ) : cartType === "list" ? (
        <ProductGrid />
      ) : cartType === "table" ? (
        <ProductTable />
      ) : null}
    </div>
  );
}
