import Link from "next/link";
import { useTranslation } from "next-i18next";
import { Button } from "~/components/ui/button";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Home() {
  const [t] = useTranslation("common");
  return (
    <div className="container flex flex-col justify-center gap-12 px-4 py-16">
      <h1 className="text-3xl font-extrabold tracking-tight text-secondary-foreground sm:text-[5rem]">
        {t("title")}
      </h1>
      <p className="text-xl  text-secondary-foreground">{t("description")}</p>
      <div className="flex flex-wrap gap-4">
        <Link href="/products">
          <Button variant="secondary" size="lg">
            {t("manageProducts")}
          </Button>
        </Link>
        <Link href="/cart">
          <Button size="lg">{t("createSale")}</Button>
        </Link>
      </div>
    </div>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
