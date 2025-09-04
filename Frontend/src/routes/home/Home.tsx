import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t, i18n } = useTranslation(["home"]);

  useEffect(() => {
    i18n.loadNamespaces("home");
  }, [i18n]);

  return (
    <section>
      <h1>{t("title", { ns: "home" })}</h1>
      <p>{t("description", { ns: "home" })}</p>
      <p>{t("greeting", { name: "Anna" })}</p>
      <p>{t("items", { count: 1 })}</p>
      <p>{t("items", { count: 5 })}</p>
    </section>
  );
}
