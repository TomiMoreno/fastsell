"use client";
import { useLocalStorage } from "usehooks-ts";

export default function useCartType() {
  const [cartType, setCartType] = useLocalStorage<"compact" | "list" | "table">(
    "cartType",
    "compact",
  );

  return { cartType, setCartType };
}
