import React from "react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation("footer");
  return (
    <footer
      style={{ textAlign: "center", padding: 16, borderTop: "1px solid #ddd" }}
    >
      <p>{t("copyright")}</p>
    </footer>
  );
}
