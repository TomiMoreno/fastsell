import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import ProductGrid from "~/components/features/cart/productGrid";

function Cart() {
  return <ProductGrid />;
}

export default Cart;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
