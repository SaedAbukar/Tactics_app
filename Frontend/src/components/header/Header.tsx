import { Link } from "react-router-dom";
import LanguageSwitcher from "../LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t } = useTranslation("header");
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: 16,
        borderBottom: "1px solid #ddd",
      }}
    >
      <Link to="/">{t("appName")}</Link>
      <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Link to="/">{t("homeLink")}</Link>
        <Link to="/tacticalEditor">{t("tacticalBoardLink")}</Link>
        <LanguageSwitcher />
      </nav>
    </header>
  );
}
