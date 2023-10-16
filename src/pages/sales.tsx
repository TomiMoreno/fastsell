import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SalesDashboard from "~/components/features/sales/dashboard";
import SalesTable from "~/components/features/sales/salesTable";

export default function Sales() {
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

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
