import { useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const LanguageSwitcher = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState(router.locale);

  const handleLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage);
    router
      .push(router.pathname, router.asPath, { locale: newLanguage })
      .catch(console.error);
  };

  return (
    <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
      <SelectTrigger className=" w-min">
        <SelectValue placeholder={t("language")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en" textValue="EN">
          {t("english")}
        </SelectItem>
        <SelectItem value="es" textValue="ES">
          {t("spanish")}
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitcher;
